"""Branded search icon, social card, crawlable EN/RU landing pages."""
from pathlib import Path
from http.server import ThreadingHTTPServer
from urllib.request import urlopen
from xml.etree import ElementTree
import json
import threading
import unittest
import server

ROOT = Path(__file__).resolve().parents[1]

class Seo517Tests(unittest.TestCase):
    def test_homepage_has_branding_and_crawlable_links(self):
        page = (ROOT/'index.html').read_text('utf-8')
        for expected in ('/assets/favicon.png', '/assets/apple-touch-icon.png', '/assets/social-preview.png',
                         '/four-player-chess', '/ru/shahmaty-na-chetveryh',
                         'application/ld+json', 'schema.org', 'https://baldchess.com/'):
            with self.subTest(expected=expected): self.assertIn(expected, page)

    def test_sitemap_includes_three_canonical_pages(self):
        root=ElementTree.fromstring((ROOT/'sitemap.xml').read_text('utf-8'))
        namespace={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls=[e.text for e in root.findall('.//s:loc', namespace)]
        self.assertEqual(urls, ['https://baldchess.com/','https://baldchess.com/four-player-chess',
                                 'https://baldchess.com/ru/shahmaty-na-chetveryh'])
        self.assertIn('/sitemap.xml',(ROOT/'robots.txt').read_text('utf-8'))

    def test_manifest_and_images_exist(self):
        manifest=json.loads((ROOT/'site.webmanifest').read_text('utf-8'))
        self.assertEqual(manifest['name'],'BaldChess')
        for name in ['assets/favicon.png','assets/favicon.ico','assets/apple-touch-icon.png',
                     'assets/icon-256.png','assets/logo.png','assets/social-preview.png']:
            self.assertGreater((ROOT/name).stat().st_size, 200)

    def test_guides_have_canonical_and_localized_content(self):
        for name,part in [('four-player-chess.html','https://baldchess.com/four-player-chess'),
                          ('chess-four-ru.html','https://baldchess.com/ru/shahmaty-na-chetveryh')]:
            page=(ROOT/name).read_text('utf-8')
            self.assertIn(f'rel="canonical" href="{part}"',page)
            self.assertIn('hreflang=',page)
            self.assertIn('<h1>',page)

    def test_all_new_urls_serve_correct_types(self):
        http=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
        thread=threading.Thread(target=http.serve_forever,daemon=True)
        thread.start()
        try:
            for path,ctype in [('/four-player-chess','text/html'),('/ru/shahmaty-na-chetveryh','text/html'),
                               ('/assets/favicon.png','image/png'),('/assets/social-preview.png','image/png'),
                               ('/assets/favicon.ico','image/x-icon'),('/site.webmanifest','application/manifest+json'),
                               ('/assets/apple-touch-icon.png','image/png'),('/sitemap.xml','application/xml')]:
                with self.subTest(path=path):
                    with urlopen(f'http://127.0.0.1:{http.server_port}{path}',timeout=4) as resp:
                        self.assertEqual(resp.status,200)
                        self.assertIn(ctype,resp.headers['Content-Type'])
                        self.assertTrue(len(resp.read())>40)
        finally:
            http.shutdown();http.server_close();thread.join(timeout=3)

if __name__=='__main__':unittest.main()
