"""Nén ảnh màu trong file GLB của Tripo (giảm dung lượng tải game, giữ nguyên hình 3D).
Cách dùng: python3 tools/tripo/shrink_glb.py <vào.glb> <ra.glb> [cạnh_tối_đa=2048] [chất_lượng_jpeg=82]"""
import sys, struct, json, io
from PIL import Image

def shrink(src, dst, maxside=2048, q=82):
    b = open(src, 'rb').read()
    jl = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + jl])
    bo = 20 + jl; bl = struct.unpack('<I', b[bo:bo + 4])[0]; binc = b[bo + 8:bo + 8 + bl]
    views = [binc[v.get('byteOffset', 0):v.get('byteOffset', 0) + v['byteLength']] for v in j['bufferViews']]
    for im in j.get('images', []):
        i = im['bufferView']; img = Image.open(io.BytesIO(views[i])).convert('RGB')
        if max(img.size) > maxside: img = img.resize((maxside, maxside * img.size[1] // img.size[0]), Image.LANCZOS)
        out = io.BytesIO(); img.save(out, 'JPEG', quality=q, optimize=True); views[i] = out.getvalue(); im['mimeType'] = 'image/jpeg'
    data = bytearray()
    for v, raw in zip(j['bufferViews'], views):
        while len(data) % 4: data.append(0)
        v['byteOffset'] = len(data); v['byteLength'] = len(raw); data += raw
    while len(data) % 4: data.append(0)
    j['buffers'][0]['byteLength'] = len(data)
    js = json.dumps(j, separators=(',', ':')).encode()
    while len(js) % 4: js += b' '
    total = 12 + 8 + len(js) + 8 + len(data)
    open(dst, 'wb').write(b'glTF' + struct.pack('<II', 2, total) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(data)) + b'BIN\x00' + bytes(data))
    return len(b), total

if __name__ == '__main__':
    a = sys.argv; print(shrink(a[1], a[2], int(a[3]) if len(a) > 3 else 2048, int(a[4]) if len(a) > 4 else 82))
