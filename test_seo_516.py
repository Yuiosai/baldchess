"""Public search-engine resources and social link preview metadata."""
from http.server import ThreadingHTTPServer
from urllib.request import urlopen
import threading
import unittest
from pathlib import Path
import server


class PublicSiteSearchTests(unittest.TestCase):
    def test_metadata_in_homepage(self):
        content=(Path(__file__).parent.parent/'index.html').read_text('utf-8')
        self.assertIn('<link rel="canonical" href="https://baldchess.com/">',content)
        self.assertIn('name="description"',content)
        self.assertIn('property="og:image"',content)
        self.assertIn('id="sound-enabled"',content)

    def test_sitemap_robots_accessible_as_static_files(self):
        http=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
        thread=threading.Thread(target=http.serve_forever,daemon=True)
        thread.start()
        try:
            for path,content_type,needle in [
                ('/robots.txt','text/plain','/sitemap.xml'),
                ('/sitemap.xml','application/xml','https://baldchess.com/')]:
                with self.subTest(path=path):
                    with urlopen(f'http://127.0.0.1:{http.server_port}'+path,timeout=4) as resp:
                        self.assertEqual(resp.status,200)
                        self.assertIn(content_type,resp.headers['Content-Type'])
                        self.assertIn(needle,resp.read().decode('utf-8'))
        finally:
            http.shutdown();http.server_close();thread.join(timeout=3)

if __name__=='__main__':unittest.main()
