"""Catch frontend HTML/JavaScript desynchronization before deployment."""
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class ElementIDs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key == 'id':
                self.ids.add(value)

class FrontendContractTests(unittest.TestCase):
    def test_every_static_client_element_exists(self):
        parser = ElementIDs()
        parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
        selectors = set(re.findall(r"\$\('([^']+)'\)", (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')))
        self.assertFalse(selectors - parser.ids, f"Missing elements: {selectors - parser.ids}")

    def test_compatibility_for_previous_client(self):
        parser = ElementIDs()
        parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
        self.assertTrue({'cancel-premove', 'premove-bar', 'premove-message', 'sound-enabled'} <= parser.ids)

    def test_updated_client_version(self):
        html = (ROOT / 'index.html').read_text(encoding='utf-8')
        self.assertIn('/js/app.js?v=51611', html)
        self.assertIn('/js/game.js?v=51611', html)
