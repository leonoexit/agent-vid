"""Worked example shown in the ISP video. Run: python example.py ; type check: mypy example.py

BEFORE: one big "interface" -> the cheap printer writes fake methods, the caller crashes at runtime.
AFTER:  small interfaces -> each class only promises what it does; a type checker flags the wrong call.
"""


# ---------- BEFORE: một danh sách to ----------
class MayVanPhong:
    def in_giay(self): ...
    def quet(self): ...
    def photo(self): ...


class MayInRe(MayVanPhong):
    def in_giay(self):
        print("Đang in...")
    def quet(self):
        raise Exception("Không quét")
    def photo(self):
        raise Exception("Không photo")


def quet_hop_dong(may: MayVanPhong):
    may.quet()


# ---------- AFTER: nhiều danh sách nhỏ ----------
class CoTheIn:
    def in_giay(self): ...

class CoTheQuet:
    def quet(self): ...

class CoThePhoto:
    def photo(self): ...


class MayInRe2(CoTheIn):  # tên "MayInRe" trên màn hình; đổi tên ở đây để hai phiên bản cùng tồn tại
    def in_giay(self):
        print("Đang in...")


class MayDaNang(CoTheIn,
                CoTheQuet,
                CoThePhoto):
    def in_giay(self):
        print("Đang in...")
    def quet(self):
        print("Đang quét...")
    def photo(self):
        print("Đang phô tô...")


def quet_hop_dong2(may: CoTheQuet):
    may.quet()


def _goi_sai() -> None:  # never executed; exists so the type checker inspects this call
    quet_hop_dong2(MayInRe2())               # mypy: incompatible type (flagged before running)


if __name__ == "__main__":
    import sys
    if sys.argv[1:] == ["after"]:
        quet_hop_dong2(MayDaNang())          # Đang quét...
        MayInRe2().in_giay()                 # Đang in...
    else:
        quet_hop_dong(MayInRe())             # Exception: Không quét  (mypy finds nothing)
