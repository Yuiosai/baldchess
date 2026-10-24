"""Single playable canonical site, metadata, images, and legacy guide redirects."""
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.request import urlopen
from http.client import HTTPConnection
from xml.etree import ElementTree
import json
import threading
import unittest
import server

ROOT = Path(__file__).resolve().parents[1]

class Seo517Tests(unittest.TestCase):
    def test_homepage_has_branding_and_russian_search_copy(self):
        page = (ROOT/'index.html').read_text('utf-8')
        for expected in ('/assets/favicon.png', '/assets/apple-touch-icon.png', '/assets/social-preview.png',
                         'шахматы на четверых онлайн', 'Шахматы для 4 игроков',
                         'application/ld+json', 'schema.org', 'https://baldchess.com/'):
            with self.subTest(expected=expected): self.assertIn(expected.lower(), page.lower())
        self.assertNotIn('class="discover-links"', page)

    def test_sitemap_only_main_page(self):
        root = ElementTree.fromstring((ROOT/'sitemap.xml').read_text('utf-8'))
        namespace = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = [e.text for e in root.findall('.//s:loc', namespace)]
        self.assertEqual(urls, ['https://baldchess.com/'])
        self.assertIn('/sitemap.xml', (ROOT/'robots.txt').read_text('utf-8'))

    def test_manifest_and_images_exist(self):
        manifest = json.loads((ROOT/'site.webmanifest').read_text('utf-8'))
        self.assertEqual(manifest['name'], 'BaldChess')
        for name in ['assets/favicon.png', 'assets/favicon.ico', 'assets/apple-touch-icon.png',
                     'assets/icon-256.png', 'assets/logo.png', 'assets/social-preview.png']:
            self.assertGreater((ROOT/name).stat().st_size, 200)

    def test_guides_removed_and_old_paths_redirect(self):
        self.assertFalse((ROOT/'four-player-chess.html').exists())
        self.assertFalse((ROOT/'chess-four-ru.html').exists())
        http = ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        thread = threading.Thread(target=http.serve_forever, daemon=True)
        thread.start()
        try:
            for path in ['/four-player-chess', '/ru/shahmaty-na-chetveryh']:
                conn = HTTPConnection('127.0.0.1', http.server_port, timeout=4)
                try:
                    conn.request('GET', path)
                    resp = conn.getresponse()
                    self.assertEqual(resp.status, 301)
                    self.assertEqual(resp.headers['Location'], '/')
                    resp.read()
                finally:
                    conn.close()
            for path, ctype in [('/', 'text/html'), ('/assets/favicon.png', 'image/png'),
                                ('/assets/social-preview.png', 'image/png'),
                                ('/assets/favicon.ico', 'image/x-icon'),
                                ('/site.webmanifest', 'application/manifest+json'),
                                ('/assets/apple-touch-icon.png', 'image/png'),
                                ('/sitemap.xml', 'application/xml')]:
                with self.subTest(path=path):
                    with urlopen(f'http://127.0.0.1:{http.server_port}{path}', timeout=4) as resp:
                        self.assertEqual(resp.status, 200)
                        self.assertIn(ctype, resp.headers['Content-Type'])
                        self.assertTrue(len(resp.read()) > 40)
        finally:
            http.shutdown();http.server_close();thread.join(timeout=3)

if __name__ == '__main__': unittest.main()
