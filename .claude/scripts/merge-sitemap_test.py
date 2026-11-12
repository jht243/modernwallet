import importlib.util
from pathlib import Path
import unittest
import shutil
import subprocess
import tempfile

spec = importlib.util.spec_from_file_location('sitemap_merge', Path(__file__).with_name('merge-sitemap.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def sitemap(**entries):
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
        f'  <url><loc>https://example.com/{url}</loc><lastmod>{date}</lastmod></url>\n'
        for url, date in entries.items()) + '</urlset>\n'


class MergeTests(unittest.TestCase):
    def test_concurrent_additions(self):
        merged = module.merge(sitemap(a='1'), sitemap(a='1', b='2'), sitemap(a='1', c='3'))
        self.assertEqual(set(module.parse(merged)[0]), {'https://example.com/a', 'https://example.com/b', 'https://example.com/c'})

    def test_deletion_is_preserved(self):
        merged = module.merge(sitemap(a='1', b='1'), sitemap(a='1'), sitemap(a='1', b='1', c='3'))
        self.assertEqual(set(module.parse(merged)[0]), {'https://example.com/a', 'https://example.com/c'})

    def test_independent_update(self):
        merged = module.merge(sitemap(a='1'), sitemap(a='2'), sitemap(a='1', c='3'))
        self.assertIn('<lastmod>2</lastmod>', merged)

    def test_same_url_disagreement_stops(self):
        with self.assertRaises(ValueError):
            module.merge(sitemap(a='1'), sitemap(a='2'), sitemap(a='3'))

    def test_deletion_versus_update_stops(self):
        with self.assertRaises(ValueError):
            module.merge(sitemap(a='1'), sitemap(), sitemap(a='2'))

    def test_identical_new_url_not_duplicated(self):
        self.assertEqual(module.merge(sitemap(), sitemap(a='1'), sitemap(a='1')).count('<url>'), 1)

    def test_identical_inherited_duplicates_collapsed(self):
        duplicate = sitemap(a='1').replace('</urlset>', '<url><loc>https://example.com/a</loc><lastmod>1</lastmod></url></urlset>')
        self.assertEqual(module.merge(duplicate, duplicate, duplicate).count('<url>'), 1)

    def test_malformed_or_duplicate_xml_stops(self):
        for invalid in ('<broken', sitemap(a='1').replace('</urlset>', '<url><loc>https://example.com/a</loc></url></urlset>')):
            with self.assertRaises((ValueError, module.ET.ParseError)):
                module.merge(sitemap(), invalid, sitemap())

    def test_publisher_recovers_real_rebase_conflict(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            def git(*args):
                return subprocess.run(['git', *args], cwd=root, capture_output=True, text=True, check=True)
            git('init', '--bare', 'remote.git')
            git('clone', str(root / 'remote.git'), 'work')
            root = root / 'work'
            git('checkout', '-b', 'main')
            git('config', 'user.name', 'Test')
            git('config', 'user.email', 'test@example.com')
            scripts = root / '.claude/scripts'
            scripts.mkdir(parents=True)
            for name in ('merge-sitemap.py', 'deploy-run-to-main.sh'):
                shutil.copyfile(Path(__file__).with_name(name), scripts / name)
            (scripts / 'deploy-regenerable.txt').write_text('public/search-index.json|true\n')
            (root / 'public').mkdir()
            target = root / 'public/sitemap-guides.xml'
            target.write_text(sitemap(a='1', removed='1'))
            git('add', '.')
            git('commit', '-m', 'base')
            git('push', '-u', 'origin', 'main')
            git('checkout', '-b', 'routine')
            subprocess.run(['bash', str(scripts / 'deploy-run-to-main.sh'), 'mark'], cwd=root, capture_output=True, check=True)
            target.write_text(sitemap(a='1', removed='1', routine='2'))
            git('add', '.')
            git('commit', '-m', 'routine adds page')
            git('checkout', 'main')
            target.write_text(sitemap(a='1', concurrent='3'))
            git('add', '.')
            git('commit', '-m', 'concurrent addition and deletion')
            git('push', 'origin', 'main')
            git('checkout', 'routine')
            result = subprocess.run(['bash', str(scripts / 'deploy-run-to-main.sh'), 'push'], cwd=root, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn('Merged sitemap:', result.stdout)
            self.assertEqual(set(module.parse(git('show', 'origin/main:public/sitemap-guides.xml').stdout)[0]),
                             {'https://example.com/a', 'https://example.com/routine', 'https://example.com/concurrent'})
            self.assertEqual(git('status', '--porcelain').stdout, '')


if __name__ == '__main__':
    unittest.main()
