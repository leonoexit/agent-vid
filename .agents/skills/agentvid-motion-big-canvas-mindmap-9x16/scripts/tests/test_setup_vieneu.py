import importlib.util
import pathlib
import tempfile
import unittest
from unittest import mock


SCRIPT = pathlib.Path(__file__).parents[1] / "setup-vieneu.py"
SPEC = importlib.util.spec_from_file_location("setup_vieneu", SCRIPT)
setup_vieneu = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(setup_vieneu)


class OnnxReadinessTests(unittest.TestCase):
    def test_version_boundary(self):
        self.assertTrue(setup_vieneu.onnx_version_supported("1.22.1"))
        self.assertTrue(setup_vieneu.onnx_version_supported("1.22.1.post1"))
        self.assertTrue(setup_vieneu.onnx_version_supported("1.23.0rc1"))
        self.assertTrue(setup_vieneu.onnx_version_supported("1.23.0.dev1"))
        self.assertFalse(setup_vieneu.onnx_version_supported("1.23.0"))
        self.assertFalse(setup_vieneu.onnx_version_supported("1.23.0.post1"))
        self.assertFalse(setup_vieneu.onnx_version_supported("2.0.0"))
        self.assertFalse(setup_vieneu.onnx_version_supported(None))
        self.assertFalse(setup_vieneu.onnx_version_supported("not-a-version"))

    def test_ready_requires_compatible_onnx_even_when_imports_pass(self):
        with mock.patch.object(setup_vieneu, "has", return_value=True), \
             mock.patch.object(setup_vieneu, "installed_onnx_version", return_value="1.23.0"):
            self.assertFalse(setup_vieneu.ready())
        with mock.patch.object(setup_vieneu, "has", return_value=True), \
             mock.patch.object(setup_vieneu, "installed_onnx_version", return_value="1.22.1"):
            self.assertTrue(setup_vieneu.ready())

    def test_normal_setup_enforces_pin_when_imports_pass_but_onnx_is_incompatible(self):
        with tempfile.TemporaryDirectory() as directory:
            home = pathlib.Path(directory)
            python = home / "vieneu-env" / "python"
            python.parent.mkdir()
            python.touch()
            completed = mock.Mock(returncode=0)
            with mock.patch.object(setup_vieneu, "HOME", home), \
                 mock.patch.object(setup_vieneu, "ENV", python.parent), \
                 mock.patch.object(setup_vieneu, "PY", python), \
                 mock.patch.object(setup_vieneu, "has", return_value=True), \
                 mock.patch.object(setup_vieneu, "installed_onnx_version", return_value="1.23.0"), \
                 mock.patch.object(setup_vieneu.shutil, "which", return_value="uv"), \
                 mock.patch.object(setup_vieneu.subprocess, "run", return_value=completed) as run, \
                 mock.patch.object(setup_vieneu.sys, "argv", ["setup-vieneu.py"]):
                setup_vieneu.main()
            installs = [call.args[0] for call in run.call_args_list if call.args and call.args[0][:3] == ["uv", "pip", "install"]]
            self.assertEqual(len(installs), 1)
            self.assertIn(setup_vieneu.ONNX_PIN, installs[0])


if __name__ == "__main__":
    unittest.main()
