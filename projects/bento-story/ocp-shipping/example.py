# Runnable model of every code state shown in the video. Fees are in thousand VND (illustrative).

# --- Before: one function owns every shipping branch -----------------------
def tinh_tien_cu(gia, giao):
    if giao == "thuong": phi = 20
    elif giao == "nhanh": phi = 35
    return gia + phi

assert tinh_tien_cu(200, "thuong") == 220
assert tinh_tien_cu(200, "nhanh") == 235
# Adding "hoatoc" here would require editing tinh_tien_cu (a new elif branch).


# --- After a one-time restructure: each method owns its fee via phi() -------
class GiaoThuong:
    def phi(self): return 20

class GiaoNhanh:
    def phi(self): return 35

def tinh_tien(gia, giao):
    return gia + giao.phi()

import inspect
before = inspect.getsource(tinh_tien)


# --- Extension: new code only ----------------------------------------------
class HoaToc:
    def phi(self): return 60

assert inspect.getsource(tinh_tien) == before          # tinh_tien was not edited
assert tinh_tien(200, HoaToc()) == 260                  # execute trace
assert tinh_tien(200, GiaoThuong()) == 220              # old behaviour unchanged
assert tinh_tien(200, GiaoNhanh()) == 235
print({"HoaToc": tinh_tien(200, HoaToc()), "GiaoThuong": tinh_tien(200, GiaoThuong())})
