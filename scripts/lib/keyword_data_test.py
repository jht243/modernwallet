import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('keyword_data', Path(__file__).with_name('keyword_data.py'))
k = importlib.util.module_from_spec(spec); spec.loader.exec_module(k)
def row(word, source='dataforseo'):
    return {'keyword': word, 'source': source, 'volume': 10 if source == 'dataforseo' else 0}

class ExpansionTests(unittest.TestCase):
    def expand(self, provider, autocomplete, limit=60, enabled=True, error=None):
        with patch.object(k, 'field_provider', return_value='dataforseo'), patch.object(k, '_fetch_expand', return_value=provider, side_effect=error) as paid, patch.object(k, '_estimate_expand', return_value=autocomplete) as free, patch.object(k, '_enrich_on', return_value=enabled), patch.object(k, '_died'):
            result = k.expand('fixture', limit)
            self.assertEqual(paid.call_count, 1)
            self.assertEqual(free.call_count, int(enabled))
            return result
    def test_full_provider_batch_keeps_autocomplete(self):
        r = self.expand([row(str(i)) for i in range(60)], [row('specific long tail', 'estimate')])
        self.assertEqual(len(r), 61); self.assertEqual(r[-1]['source'], 'estimate')
    def test_two_full_pools_and_provider_overflow_are_bounded(self):
        r = self.expand([row('p'+str(i)) for i in range(75)], [row('a'+str(i), 'estimate') for i in range(70)])
        self.assertEqual(len(r), 120); self.assertEqual(sum(x['source']=='estimate' for x in r), 60)
    def test_duplicates_preserve_provider_metrics(self):
        r = self.expand([row('Same phrase'), row('SAME  phrase')], [row(' same phrase ', 'estimate'), row('other', 'estimate'), row('OTHER', 'estimate')])
        self.assertEqual(len(r), 2); self.assertEqual(r[0]['volume'], 10)
    def test_fallback_keeps_estimate_provenance(self):
        r = self.expand([], [row('live suggestion', 'estimate')], error=RuntimeError('offline'))
        self.assertEqual(r[0]['source'], 'estimate')
    def test_disabled_enrichment(self):
        self.assertEqual(len(self.expand([row(str(i)) for i in range(70)], [], enabled=False)), 60)
    def test_tiny_limit_does_not_starve_either_source(self):
        self.assertEqual(len(self.expand([row('provider')], [row('auto', 'estimate')], limit=1)), 2)
    def test_invalid_limit_never_calls_provider(self):
        with patch.object(k, 'field_provider') as provider:
            for limit in [0, -1]:
                with self.assertRaises(ValueError): k.expand('fixture', limit)
            provider.assert_not_called()
    def test_pinned_provider_never_probes_excluded_vendors(self):
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': 'dataforseo'}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', return_value=True) as probe:
            self.assertEqual(k.field_provider('expand'), 'dataforseo')
            self.assertEqual([c.args[0] for c in probe.call_args_list], ['dataforseo'])
    def test_pinned_dry_provider_does_not_fall_to_excluded_vendor(self):
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': 'dataforseo'}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', return_value=False) as probe:
            self.assertIsNone(k.field_provider('expand'))
            self.assertEqual([c.args[0] for c in probe.call_args_list], ['dataforseo'])
    def test_empty_sources(self): self.assertEqual(self.expand([], []), [])

if __name__ == '__main__': unittest.main()
