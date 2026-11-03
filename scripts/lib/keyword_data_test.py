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
    def test_autocomplete_overlap_beyond_provider_slice_keeps_metrics(self):
        r = self.expand([row('first'), row('overlap')], [row('overlap', 'estimate')], limit=1)
        self.assertEqual(len(r), 2); self.assertEqual(r[-1]['source'], 'dataforseo')
        self.assertEqual(r[-1]['volume'], 10)
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
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': 'dataforseo', 'SEMRUSH_ENABLED': '0'}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', return_value=True) as probe:
            self.assertEqual(k.field_provider('expand'), 'dataforseo')
            self.assertEqual([c.args[0] for c in probe.call_args_list], ['dataforseo'])
    def test_pinned_dry_provider_does_not_fall_to_excluded_vendor(self):
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': 'dataforseo', 'SEMRUSH_ENABLED': '0'}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', return_value=False) as probe:
            self.assertIsNone(k.field_provider('expand'))
            self.assertEqual([c.args[0] for c in probe.call_args_list], ['dataforseo'])
    def test_old_dataforseo_pin_puts_semrush_first_never_ahrefs(self):
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': 'dataforseo'}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', side_effect=lambda n, d: n == 'dataforseo') as probe:
            k.os.environ.pop('SEMRUSH_ENABLED', None)
            self.assertEqual(k.field_provider('volume'), 'dataforseo')
            self.assertEqual([c.args[0] for c in probe.call_args_list], ['semrush', 'dataforseo'])
    def test_default_order_is_semrush_first(self):
        with patch.dict(k.os.environ, {'KEYWORD_PROVIDERS': ''}), patch.dict(k._FIELD_PROVIDER, {}, clear=True), patch.object(k, '_provider_usable', return_value=True):
            self.assertEqual({f: k.field_provider(f) for f in ('volume', 'kd', 'expand')}, {'volume': 'semrush', 'kd': 'semrush', 'expand': 'semrush'})
    def test_empty_sources(self): self.assertEqual(self.expand([], []), [])

class CostTests(unittest.TestCase):
    def test_semrush_volumes_is_one_phrase_these_call(self):
        csv_rows = [{'Keyword': 'kobo vs nook', 'Search Volume': '260', 'CPC': '0.5', 'Keyword Difficulty Index': '16'}]
        with patch.object(k, '_semrush_csv', return_value=csv_rows) as api:
            r = k._semrush_volumes(['kobo vs nook'], 'us')
        self.assertEqual([c.args[0]['type'] for c in api.call_args_list], ['phrase_these'])
        self.assertEqual((r['kobo vs nook']['volume'], r['kobo vs nook']['kd']), (260, '16'))

    def volumes(self, cached, fetched):
        fetch = patch.object(k, '_fetch_volumes', return_value=fetched)
        with patch.object(k, '_cache_get', return_value=cached), patch.object(k, '_cache_put') as put, \
             fetch as paid, patch.object(k, 'field_provider', return_value='semrush'), \
             patch.dict(k._FIELD_PROVIDER, {'volume': 'semrush'}), patch.object(k, '_enrich_rows'), \
             patch.object(k, '_estimate_volumes', return_value={}):
            return k.volumes(['a', 'b', 'c']), paid, put

    def test_cache_hits_are_not_bought_again(self):
        hit = {'keyword': 'a', 'volume': 50, 'kd': 10, 'source': 'semrush', 'kd_source': 'semrush'}
        got = {'b': {'keyword': 'b', 'volume': 70, 'kd': 5, 'source': 'semrush'}}
        out, paid, put = self.volumes({'a': hit, 'c': None}, got)
        self.assertEqual(paid.call_args.args[1], ['b'])          # only the miss is bought
        self.assertEqual(out['a']['volume'], 50); self.assertNotIn('c', out)
        self.assertEqual(put.call_args.args[1], [])               # b answered, nothing new to mark empty

    def test_full_cache_hit_makes_no_paid_call(self):
        rows = {x: {'keyword': x, 'volume': 1, 'kd': 1, 'source': 'semrush', 'kd_source': 'semrush'} for x in 'abc'}
        out, paid, put = self.volumes(rows, {})
        paid.assert_not_called(); put.assert_not_called(); self.assertEqual(len(out), 3)

    def test_misses_without_data_are_cached_empty(self):
        out, paid, put = self.volumes({}, {'a': {'keyword': 'a', 'volume': 9, 'kd': 1, 'source': 'semrush'}})
        self.assertEqual(sorted(put.call_args.args[1]), ['b', 'c']); self.assertEqual(put.call_args.args[2], 'semrush')

    def test_cache_off_without_flag(self):
        with patch.dict(k.os.environ, {'KEYWORD_CACHE': '0'}):
            self.assertEqual(k._cache_get(['a'], 'us'), {})

if __name__ == '__main__': unittest.main()
