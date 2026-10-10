"""Gate A/B/C for motion projects: layout detection, brand and source errors, stamps bound to the data files, receipt, sale purpose.

Run: python -m unittest discover -s scripts/tests
"""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
GATE = SCRIPTS / "review-gate.py"
if not GATE.is_file():  # kit source: the shared scripts live in kits/review-gates
    GATE = SCRIPTS.parents[2] / "review-gates" / "review-gate.py"
TEXT = SCRIPTS / "review-motion-script.py"
THEME = {"review": {"brandBlocklist": ["Shopee"], "risks": [{"pattern": "(?<!\\w)(?:chữa)(?!\\w)", "note": "cure claim"}],
                    "checklist": ["Facts match facts.md."]}}


def run(script, *args):
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, encoding="utf-8", errors="replace")


class MotionGateTests(unittest.TestCase):
    def project(self, tmp, **script):
        proj = Path(tmp)
        (proj / "data").mkdir()
        (proj / "scenes").mkdir()
        (proj / "index.html").write_text("<html></html>", encoding="utf8")
        (proj / "data" / "theme.json").write_text(json.dumps(THEME), encoding="utf8")
        body = {"title": "t", "source": "Số liệu minh hoạ", "scenes": [{"id": "a", "lines": [{"text": "Xin chào."}]},
                                                                      {"id": "b", "lines": [{"text": "Tạm biệt."}]}], **script}
        (proj / "data" / "script.json").write_text(json.dumps(body, ensure_ascii=False), encoding="utf8")
        (proj / "data" / "storyboard.json").write_text(json.dumps({"scenes": [{"id": "a", "label": "Hai"}]}), encoding="utf8")
        return proj

    def test_clean_project_passes_and_missing_source_or_brand_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.project(tmp)
            self.assertEqual(run(TEXT, "--project", tmp).returncode, 0)
        with tempfile.TemporaryDirectory() as tmp:
            self.project(tmp, source="")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn('needs a "source"', out.stdout)
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "storyboard.json").write_text(json.dumps({"scenes": [{"label": "Mua trên Shopee"}]}, ensure_ascii=False), encoding="utf8")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("Shopee", out.stdout)

    def test_forbidden_text_is_an_error_only_when_the_theme_opts_in(self):
        rule = {"pattern": "[—–→]|-->", "note": "no dashes or arrows"}
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "storyboard.json").write_text(json.dumps({"scenes": [{"id": "a", "label": "Nhanh → gọn"}]}, ensure_ascii=False), encoding="utf8")
            self.assertEqual(run(TEXT, "--project", tmp).returncode, 0)  # THEME has no forbiddenText: unchanged behaviour
            strict = {"review": {**THEME["review"], "forbiddenText": [rule]}}
            (proj / "data" / "theme.json").write_text(json.dumps(strict), encoding="utf8")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("no dashes or arrows", out.stdout)
        with tempfile.TemporaryDirectory() as tmp:  # spoken text is covered too
            proj = self.project(tmp, scenes=[{"id": "a", "lines": [{"text": "Một – hai."}]}, {"id": "b", "lines": [{"text": "Hết."}]}])
            (proj / "data" / "theme.json").write_text(json.dumps({"review": {"forbiddenText": [rule]}}), encoding="utf8")
            self.assertEqual(run(TEXT, "--project", tmp).returncode, 1)

    def test_warnings_for_absolute_claims_risks_and_unsourced_numbers(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.project(tmp, source="Tự viết", scenes=[
                {"id": "a", "lines": [{"text": "Chắc chắn chữa khỏi 90% ca."}]}, {"id": "b", "lines": [{"text": "Hết."}]}])
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 0)
            for part in ('absolute claim "chắc chắn"', "cure claim", "numbers on screen"):
                self.assertIn(part, out.stdout)

    def test_stamps_bind_to_the_data_files_and_sale_needs_all_gates(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            run(TEXT, "--project", tmp)
            stamp = [GATE, "stamp", "--project", tmp, "--gate", "A", "--verdict", "pass"]
            self.assertNotEqual(run(*stamp, "--reviewer", "x", "--author", "x").returncode, 0)
            self.assertEqual(run(*stamp, "--reviewer", "codex", "--author", "claude", "--reviewer-kind", "model").returncode, 0)
            self.assertEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)
            self.assertNotEqual(run(GATE, "require", "--project", tmp, "--purpose", "sale").returncode, 0)  # B and C missing
            (proj / "data" / "script.json").write_text(json.dumps({"title": "other", "source": "x", "scenes": []}), encoding="utf8")
            self.assertNotEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)  # script changed
            self.assertNotEqual(run(GATE, "render", "--project", tmp, "--output", str(proj / "o.mp4")).returncode, 0)

    def test_gate_a_goes_stale_when_any_reviewed_text_changes_but_not_when_voice_is_added(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            run(TEXT, "--project", tmp)
            stamp = [GATE, "stamp", "--project", tmp, "--gate", "A", "--verdict", "pass", "--reviewer", "codex", "--author", "claude"]
            self.assertEqual(run(*stamp).returncode, 0)
            (proj / "assets" / "audio").mkdir(parents=True)
            (proj / "assets" / "audio" / "mix.m4a").write_bytes(b"voice")  # made after gate A
            (proj / "data" / "timeline.json").write_text("{}", encoding="utf8")
            self.assertEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)
            (proj / "data" / "storyboard.json").write_text(json.dumps({"scenes": [{"label": "Khác"}]}, ensure_ascii=False), encoding="utf8")
            self.assertNotEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)
            self.assertNotEqual(run(*stamp).returncode, 0)  # the report no longer matches: run the script again

    def test_receipt_is_refused_when_files_changed_during_the_render(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            before = run(GATE, "hash", "--project", tmp).stdout.strip()
            mp4 = proj / "out.mp4"
            mp4.write_bytes(b"video")
            self.assertEqual(run(GATE, "receipt", "--project", tmp, "--output", str(mp4), "--expect-inputs-sha", before).returncode, 0)
            (proj / "index.html").write_text("<html>edited</html>", encoding="utf8")
            self.assertNotEqual(run(GATE, "receipt", "--project", tmp, "--output", str(mp4), "--expect-inputs-sha", before).returncode, 0)
            self.assertFalse(mp4.exists())

    def test_facts_are_part_of_what_gate_a_reviewed(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "facts.md").write_text("fact", encoding="utf8")
            run(TEXT, "--project", tmp)
            run(GATE, "stamp", "--project", tmp, "--gate", "A", "--verdict", "pass", "--reviewer", "codex", "--author", "claude")
            self.assertEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)
            (proj / "data" / "facts.md").write_text("another fact", encoding="utf8")
            self.assertNotEqual(run(GATE, "require", "--project", tmp, "--gates", "A").returncode, 0)

    def test_empty_text_sources_do_not_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = Path(tmp)
            (proj / "data").mkdir()
            (proj / "data" / "storyboard.json").write_text("{}", encoding="utf8")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("no text", out.stdout)

    def test_empty_storyboard_fails_even_with_a_script(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "storyboard.json").write_text("{}", encoding="utf8")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("storyboard.json has no text", out.stdout)

    def test_storyboard_with_only_identifiers_has_no_text(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "storyboard.json").write_text(json.dumps({"scenes": [{"id": "a", "type": "swarm", "icon": "bolt", "src": "assets/x.png"}]}), encoding="utf8")
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("storyboard.json has no text", out.stdout)

    def test_receipt_refuses_an_empty_or_wrong_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            mp4 = proj / "x.mp4"
            mp4.write_bytes(b"v")
            for bad in ("", "abc", "0" * 64):
                self.assertNotEqual(run(GATE, "receipt", "--project", tmp, "--output", str(mp4), "--expect-inputs-sha", bad).returncode, 0)
                mp4.write_bytes(b"v")

    def test_receipt_needs_the_pre_render_hash(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            mp4 = proj / "x.mp4"
            mp4.write_bytes(b"v")
            self.assertNotEqual(run(GATE, "receipt", "--project", tmp, "--output", str(mp4)).returncode, 0)

    def test_gate_a_needs_a_text_source_and_scenes(self):
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp, scenes=[])
            out = run(TEXT, "--project", tmp)
            self.assertEqual(out.returncode, 1)
            self.assertIn("no scenes", out.stdout)

    def test_inputs_cover_data_scenes_assets_but_not_the_render_report(self):
        sys.path.insert(0, str(GATE.parent))
        import importlib.util
        spec = importlib.util.spec_from_file_location("rg", GATE)
        rg = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(rg)
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "scenes" / "x.js").write_text("1", encoding="utf8")
            (proj / "data" / "render-report.json").write_text("{}", encoding="utf8")
            names = {p.relative_to(proj).as_posix() for p in rg.input_files(proj)}
            self.assertIn("scenes/x.js", names)
            self.assertIn("data/storyboard.json", names)
            self.assertNotIn("data/render-report.json", names)
            before = rg.inputs_sha(proj)
            (proj / "data" / "render-report.json").write_text('{"a":1}', encoding="utf8")
            self.assertEqual(rg.inputs_sha(proj), before)

    def test_production_log_is_bookkeeping_but_script_changes_still_count(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("rg", GATE)
        rg = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(rg)
        with tempfile.TemporaryDirectory() as tmp:
            proj = self.project(tmp)
            (proj / "data" / "production-log.json").write_text("{}", encoding="utf8")
            names = {p.relative_to(proj).as_posix() for p in rg.input_files(proj)}
            self.assertNotIn("data/production-log.json", names)
            before = rg.inputs_sha(proj)
            (proj / "data" / "production-log.json").write_text('{"marks":[1]}', encoding="utf8")
            self.assertEqual(rg.inputs_sha(proj), before)
            (proj / "data" / "storyboard.json").write_text('{"scenes":[{"id":"changed"}]}', encoding="utf8")
            self.assertNotEqual(rg.inputs_sha(proj), before)


if __name__ == "__main__":
    unittest.main()
