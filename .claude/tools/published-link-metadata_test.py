"""Only exact metadata additions qualify; content/source changes remain blocked."""
import importlib.util,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('actual_freshness',Path(__file__).with_name('worktree-freshness.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Tests(unittest.TestCase):
 def entry(self,text,mode='100644'):return mode,text.encode()
 def test_plain_and_escaped_additions_preserve_original_source(self):
  for quote in ['"','\\"']:
   pub='<p>Exact answer <a href='+quote+'https://example.org/a'+quote+'>source</a>.</p>'
   local=pub.replace('>source',' rel='+quote+'sponsored nofollow noopener noreferrer'+quote+'>source')
   self.assertTrue(m.only_adds_published_link_rel(self.entry(local),self.entry(pub)))
   self.assertTrue(m.includes_published(self.entry('old source'),self.entry(local),self.entry(pub)))
 def test_cannot_remove_old_rel_or_move_it_to_another_link(self):
  attr=' rel="sponsored nofollow noopener noreferrer"'
  pub='<a href="https://a.example"'+attr+'>A</a><a href="https://b.example">B</a>'
  moved=pub.replace(attr,'').replace('>B',attr+'>B')
  self.assertFalse(m.only_adds_published_link_rel(self.entry(moved),self.entry(pub)))
  self.assertFalse(m.only_adds_published_link_rel(self.entry(pub.replace(attr,'')),self.entry(pub)))
 def test_href_copy_modes_and_unrelated_code_changes_never_qualify(self):
  pub='<a href="https://example.org">Exact source</a>'
  local=pub.replace('>Exact',' rel="sponsored nofollow noopener noreferrer">Exact')
  for changed in [local.replace('Exact source','Different claim'),local.replace('example.org','other.example'),local+'; executeSomething()']:
   self.assertFalse(m.only_adds_published_link_rel(self.entry(changed),self.entry(pub)))
  self.assertFalse(m.only_adds_published_link_rel(self.entry(local,'100755'),self.entry(pub)))
 def test_old_quote_style_cannot_change_even_when_another_rel_is_added(self):
  escaped=' rel=\\"sponsored nofollow noopener noreferrer\\"';plain=' rel="sponsored nofollow noopener noreferrer"'
  pub='<a href="https://a.example"'+escaped+'>A</a><a href="https://b.example">B</a>'
  modified=pub.replace(escaped,plain).replace('>B',plain+'>B')
  self.assertFalse(m.only_adds_published_link_rel(self.entry(modified),self.entry(pub)))
 def test_existing_attributes_remain_and_duplicate_rel_is_rejected(self):
  attr=' rel="sponsored nofollow noopener noreferrer"'
  pub='<a href="https://a.example"'+attr+'>A</a><a href="https://b.example">B</a>'
  self.assertTrue(m.only_adds_published_link_rel(self.entry(pub.replace('>B',attr+'>B')),self.entry(pub)))
  self.assertFalse(m.only_adds_published_link_rel(self.entry(pub.replace('>A',attr+'>A')),self.entry(pub)))
if __name__=='__main__':unittest.main()
