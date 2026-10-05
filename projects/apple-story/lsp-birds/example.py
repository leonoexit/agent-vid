"""Executes every code fragment shown in the LSP video and asserts the narrated results."""

# ── Before: the parent promises bay(); the penguin breaks that promise ──
class Chim:
    def bay(self):
        print("Bay lên!")


class ChimSe(Chim):
    pass


class ChimCanhCut(Chim):
    def bay(self):
        raise Exception("Không biết bay!")


def tha_chim(chim):
    chim.bay()


tha_chim(ChimSe())  # Bay lên!
try:
    tha_chim(ChimCanhCut())
    raise AssertionError("expected the penguin to crash tha_chim")
except Exception as error:
    assert str(error) == "Không biết bay!"


# ── After: Chim only promises what every bird can do ──
class Chim:  # noqa: F811
    def an(self):
        print("Đang ăn")


class ChimBietBay(Chim):
    def bay(self):
        print("Bay lên!")


class ChimSe(ChimBietBay):  # noqa: F811
    pass


class ChimCanhCut(Chim):  # noqa: F811
    pass


def tha_chim(chim: ChimBietBay):  # noqa: F811
    chim.bay()


def cho_an(chim: Chim):
    chim.an()


tha_chim(ChimSe())        # Bay lên!
cho_an(ChimSe())          # Đang ăn
cho_an(ChimCanhCut())     # Đang ăn
assert not hasattr(ChimCanhCut(), "bay")
assert isinstance(ChimSe(), Chim) and isinstance(ChimCanhCut(), Chim)
print("All displayed results verified.")
