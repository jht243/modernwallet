import importlib.util
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('gate',Path(__file__).with_name('tool_usage_gate.py'))
gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(gate)
ACTION='''| problem | solution | bucket | target |
|---|---|---|---|
| lookup: no match | Create /example | create new content | /example |
'''
CHECKS='''## Instruction checks

| Instruction | Read | Followed | Evidence or next step |
|---|---|---|---|
| Duplicate check | ✅ Read | ✅ Verified | independent-review.md |
| Testing evidence and labels | ✅ Read | ◻ Pending | Phase 4 |

## Per-page checks

| Page | Duplicate check | Testing eligibility | Testing evidence and labels | Phase 4 | Evidence |
|---|---|---|---|---|---|
| /example | ✅ Verified | ✅ Verified — excluded explainer | ◻ Pending | ◻ Pending | review.md |
'''
class ChartParserTests(unittest.TestCase):
    def test_checklist_does_not_become_action_rows(self):
        _,rows=gate.chart_rows(ACTION+'\n'+CHECKS)
        self.assertEqual(len(rows),1);self.assertEqual(rows[0]['target'],'/example')
    def test_checklist_before_action_table_is_ignored(self):
        _,rows=gate.chart_rows(CHECKS+'\n## Actions\n\n'+ACTION)
        self.assertEqual(len(rows),1)
    def test_zero_action_chart_does_not_turn_checks_into_actions(self):
        self.assertEqual(gate.chart_rows(CHECKS),([],[]))
    def test_following_cluster_table_is_not_an_action(self):
        _,rows=gate.chart_rows(ACTION+'\n## Emerging clusters\n\n| Cluster | Lever | Target |\n|---|---|---|\n| example | create new content | /example |\n')
        self.assertEqual(len(rows),1)
    def test_final_gate_accepts_verified_manifest_and_preserves_legacy_pass(self):
        import ast, re
        tree=ast.parse(Path(gate.__file__).read_text())
        pattern=next(n.value for n in ast.walk(tree) if isinstance(n,ast.Constant) and isinstance(n.value,str) and n.value.startswith('duplicate check['))
        self.assertIsNotNone(re.search(pattern,'| Duplicate check | 2 | ✅ Verified |',re.I))
        self.assertIsNotNone(re.search(pattern,'| Duplicate check | 2 | **passed** |',re.I))
        self.assertIsNone(re.search(pattern,'| Duplicate check | 2 | ◻ Pending |\nBuild passed',re.I))
    def test_numbered_existing_action_schema_still_parses(self):
        chart=ACTION.replace('| problem','| # | problem').replace('|---|','|---|---|',1).replace('| lookup:','| 1 | lookup:')
        _,rows=gate.chart_rows(chart+'\n'+CHECKS)
        self.assertEqual(rows[0]['#'],'1');self.assertEqual(rows[0]['bucket'],'create new content')

if __name__=='__main__':unittest.main()
