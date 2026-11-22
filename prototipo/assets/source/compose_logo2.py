"""Logo TRAKAS con la mascota oficial: misma composición del logo aprobado, chile nuevo (espejado, sin brazos ni piernas).
Uso: python3 -I compose_logo2.py <out.png> [escala] [dx] [dy]"""
import sys, numpy as np, cv2
from PIL import Image
OUT = sys.argv[1]
S = float(sys.argv[2]) if len(sys.argv) > 2 else 0.92
DX = float(sys.argv[3]) if len(sys.argv) > 3 else 0
DY = float(sys.argv[4]) if len(sys.argv) > 4 else 0
LE = '/tmp/claude-0/-home-user/68e0d0b4-f907-51ff-bca5-15927c20ee5e/scratchpad/le/'
A = '/home/user/trakas-mexican-food/assets/'
H = W = 2000
kk = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

master = np.array(Image.open(A + 'source/logo-trakas-master.png')).astype(np.float32) / 255
fg = np.load(LE + 'fg_masks.npz')
plate = np.maximum.reduce([fg['blk_a'], fg['line2'], fg['flags'], fg['letters']])

# ---------- 1. fondo del emblema (procedural, mismas medidas) ----------
CX, CY = 1001.5, 1011.7; R_IN, R_OUT, R_EDGE = 748, 789, 829
RX, RY, R_RED, R_RIM = 992.6, 989.3, 579, 603
def ramp(v, a, b): return np.clip((v - a) / (b - a), 0, 1)
d = np.hypot(xx - CX, yy - CY); dr = np.hypot(xx - RX, yy - RY)
bg = np.zeros((H, W, 4), np.float32)
disk = 1 - ramp(d, R_EDGE - 1, R_EDGE + 1)
bg[..., 3] = disk
ring = ramp(d, R_IN - 1, R_IN + 1) * (1 - ramp(d, R_OUT - 1, R_OUT + 1))
bg[..., :3] += ring[..., None] * np.array([5, 135, 9]) / 255
rim = 1 - ramp(dr, R_RIM - 1, R_RIM + 1)
bg[..., :3] = bg[..., :3] * (1 - rim[..., None]) + np.array([255, 246, 229]) / 255 * rim[..., None]
red = 1 - ramp(dr, R_RED - 1, R_RED + 1)
t = np.clip(np.hypot(xx - 860, yy - 760) / 760, 0, 1)[..., None] ** 1.2
redc = np.array([238, 24, 12]) / 255 * (1 - t) + np.array([150, 4, 4]) / 255 * t
bg[..., :3] = bg[..., :3] * (1 - red[..., None]) + redc * red[..., None]

# ---------- 2. mascota: espejo, sin brazos ni piernas ----------
m = np.array(Image.open(A + 'mascota-oficial/chile-fuego.png')).astype(np.float32) / 255
mh, mw = m.shape[:2]
my, mx = np.mgrid[0:mh, 0:mw]
cut = np.ones((mh, mw), bool)
cut &= my < 1235                                   # todo lo que baja de la boca queda detrás de TRAKAS
# brazos: prolongar los bordes del cuerpo con una recta y cortar lo que queda fuera
alpha_m = m[..., 3] > 0.5
def edge_fit(r0, r1, side):
    rows = np.arange(r0, r1); e = []
    for r in rows:
        xs_ = np.nonzero(alpha_m[r, 700:1350])[0] + 700
        e.append(xs_.min() if side == 'L' else xs_.max())
    return np.polyfit(rows, np.array(e, float), 1)
xl_line = np.polyval(edge_fit(1110, 1146, 'L'), my)
xr_line = np.polyval(edge_fit(1100, 1166, 'R'), my)
cut &= ~((my > 1108) & (mx < xl_line - 16 * np.sin(np.pi * np.clip((my - 1108) / 128.0, 0, 1) * 0.8)))  # brazo y guante del lado del fuego
cut &= ~((my > 1166) & (mx > xr_line))           # brazo de la mano en la cadera
tt_ = np.clip((my - 1108) / (1236 - 1108.0), 0, 1)
xl_curve = xl_line - 16 * np.sin(np.pi * tt_ * 0.8)
BULGE = (my > 1108) & (my < 1236) & (mx >= xl_curve) & (mx < xl_line)
OUTL = (my > 1108) & (my < 1236) & (mx >= xl_curve) & (mx < xl_curve + 17)
# quedarse con la pieza principal (descarta restos sueltos del brazo)
n_, lab_, st_, _ = cv2.connectedComponentsWithStats((cut & alpha_m).astype(np.uint8), 8)
main_ = np.argmax(st_[1:, 4]) + 1
keepc = lab_ == main_
for i in range(1, n_):
    if i != main_ and st_[i][1] < 1050 and st_[i][4] > 30: keepc |= lab_ == i     # chispas del fuego (arriba)
cut &= keepc | ~alpha_m
mm = m.copy()
_a8 = (m[..., 3] > 0.5).astype(np.uint8)
_rim = (_a8 - cv2.erode(_a8, kk(3))).astype(bool) | ((m[..., 3] > 0.02) & (m[..., 3] < 0.98))
_hsv = cv2.cvtColor((m[..., :3] * 255).astype(np.uint8), cv2.COLOR_RGB2HSV)
_pale = (_hsv[..., 1] < 90) & (_hsv[..., 2] > 120)
mm[_rim & _pale, :3] = 0.02
# fuego (región a la izquierda del cuerpo, bajo el ala): más saturado
brim_y = np.interp(mx, [250, 560, 870], [330, 520, 700])
FIRE_SRC = (mx < 850) & (my > brim_y) & (my < 1110) & (m[..., 3] > 0.3)
_h2 = _hsv.astype(np.float32); _h2[..., 1] = np.where(FIRE_SRC & ((_hsv[..., 0] < 12) | (_hsv[..., 0] > 165)), np.clip(_h2[..., 1] * 1.2, 0, 255), _h2[..., 1])
_h2[..., 2] = np.where(FIRE_SRC & ((_hsv[..., 0] < 12) | (_hsv[..., 0] > 165)), np.clip(_h2[..., 2] * 1.08, 0, 255), _h2[..., 2])
mm[FIRE_SRC, :3] = (cv2.cvtColor(_h2.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32) / 255)[FIRE_SRC]
# raíz del brazo de la cadera dibujada sobre el cuerpo: repetir la fila 1120 desplazada siguiendo el borde
pr_ = edge_fit(1100, 1166, 'R')
for r in range(1140, 1236):
    off = int(round(np.polyval(pr_, r) - np.polyval(pr_, 1120)))
    xe = int(np.polyval(pr_, r)) + 2
    xs_d = np.arange(1080, xe)
    mm[r, xs_d] = m[1120, np.clip(xs_d - off, 0, mw - 1)]
# rellenar la panza nueva con el color interior de la misma fila
for r in range(1109, 1236):
    xs_b = np.nonzero(BULGE[r])[0]
    if len(xs_b): mm[r, xs_b, :3] = m[r, int(xl_line[r, 0]) + 22, :3]; mm[r, xs_b, 3] = 1
mm[~cut] = 0
mm[OUTL & cut, :3] = 0.02; mm[OUTL & cut, 3] = 1
mm = mm[:, ::-1]                                    # espejo: el fuego va a la derecha como en el logo
# anclaje por las gafas: centro de gafas espejado (955, 825) -> centro de gafas del logo (850, 815)
GX, GY = 2000 - 1045, 825
TX, TY = 850 + DX, 790 + DY
M = np.float32([[S, 0, TX - S * GX], [0, S, TY - S * GY]])
pre = mm.copy(); pre[..., :3] *= pre[..., 3:]
wm = cv2.warpAffine(pre, M, (W, H), flags=cv2.INTER_AREA if S < 1 else cv2.INTER_CUBIC)
wa = np.clip(wm[..., 3], 0, 1)

def over(dst, c_pm, a):
    dst[..., :3] = c_pm + dst[..., :3] * (1 - a[..., None]); dst[..., 3] = a + dst[..., 3] * (1 - a)

out = bg.copy(); out[..., :3] *= out[..., 3:]
# contorno negro tipo sticker alrededor de la mascota (donde sale del disco)
sil = cv2.dilate((wa > 0.5).astype(np.uint8), kk(22)).astype(np.float32)
sil = cv2.GaussianBlur(sil, (0, 0), 1.2) * ramp(d, R_EDGE - 60, R_EDGE - 20)    # solo donde sale del disco
over(out, np.zeros((H, W, 3), np.float32), sil)
fs = np.zeros((mh, mw), np.float32); fs[FIRE_SRC] = 1; fs = fs[:, ::-1].copy()
fw = cv2.warpAffine(fs, M, (W, H), flags=cv2.INTER_LINEAR) > 0.5
fo = cv2.dilate(fw.astype(np.uint8), kk(10)).astype(bool) & ~(wa > 0.5)
fo_a = cv2.GaussianBlur(fo.astype(np.float32), (0, 0), 1.0)
over(out, np.zeros((H, W, 3), np.float32), fo_a)
over(out, wm[..., :3], wa)

# ---------- 3. placa con TRAKAS / MEXICAN FOOD / banderas del logo aprobado ----------
mp = master.copy(); mp[..., :3] *= mp[..., 3:]
pa = np.clip(plate, 0, 1) * master[..., 3]
over(out, mp[..., :3] * (pa / np.maximum(master[..., 3], 1e-6))[..., None], pa)
# arco verde inferior del logo (bajo la placa) y borde exterior
low = (yy > 1500) & (d > R_IN - 10)
la = master[..., 3] * low
over(out, mp[..., :3] * low[..., None], la)

# ---------- salida ----------
a = np.clip(out[..., 3], 0, 1)
col = np.where(a[..., None] > 0, out[..., :3] / np.maximum(a[..., None], 1e-6), 0)
n, lab, st, _ = cv2.connectedComponentsWithStats((a > 0.04).astype(np.uint8), 8)
big = np.argmax(st[1:, 4]) + 1
for i in range(1, n):
    if i != big and st[i][4] < 1500: a[lab == i] = 0
Image.fromarray((np.dstack([np.clip(col, 0, 1), a]) * 255).astype(np.uint8), 'RGBA').save(OUT)
print('ok', OUT)
