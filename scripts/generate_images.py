import json
import os
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PUBLIC = ROOT / "public"

DEFAULT_PALETTE = ["#7C3AED", "#F472B6", "#22C55E", "#0F172A", "#FFFFFF"]


def hex_to_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join([c * 2 for c in h])
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def blend(c1, c2, t):
    return tuple(int(c1[i] * (1 - t) + c2[i] * t) for i in range(3))


def gradient(size, c1, c2):
    base = Image.linear_gradient("L").resize(size)
    return ImageOps.colorize(base, c1, c2).convert("RGB")


def add_shapes(img, palette):
    w, h = img.size
    draw = ImageDraw.Draw(img, "RGBA")
    for _ in range(6):
        color = random.choice(palette)
        r = random.randint(int(min(w, h) * 0.15), int(min(w, h) * 0.45))
        x = random.randint(-r // 2, w - r // 2)
        y = random.randint(-r // 2, h - r // 2)
        a = random.randint(30, 90)
        draw.ellipse([x, y, x + r, y + r], fill=(*color, a))
    return img


def add_noise(img):
    noise = Image.effect_noise(img.size, 8).convert("L")
    noise = ImageOps.colorize(noise, (0, 0, 0), (32, 32, 32)).convert("RGBA")
    alpha = Image.new("L", img.size, 20)
    noise.putalpha(alpha)
    base = img.convert("RGBA")
    base.alpha_composite(noise)
    return base.convert("RGB")


def size_for(src):
    name = Path(src).name.lower()
    if "logo" in name:
        return (512, 128)
    if "gallery" in name:
        return (1200, 1200)
    if "hero" in name:
        return (1600, 900)
    if "/hero/" in src.replace("\\", "/"):
        return (1600, 900)
    return (1200, 800)


def load_palettes():
    palettes = {}
    for popup in (CONTENT / "popups").glob("*.json"):
        data = json.loads(popup.read_text(encoding="utf-8"))
        theme = data.get("theme", {})
        colors = [
            theme.get("primary"),
            theme.get("secondary"),
            theme.get("accent"),
            theme.get("bg"),
            theme.get("fg")
        ]
        colors = [c for c in colors if isinstance(c, str) and c.startswith("#")]
        if not colors:
            colors = DEFAULT_PALETTE
        palettes[data["popupKey"]] = [hex_to_rgb(c) for c in colors]
    return palettes


def collect_srcs():
    srcs = []
    for path in CONTENT.rglob("*.json"):
        data = json.loads(path.read_text(encoding="utf-8"))
        stack = [data]
        while stack:
            obj = stack.pop()
            if isinstance(obj, dict):
                for k, v in obj.items():
                    if k == "src" and isinstance(v, str):
                        srcs.append(v)
                    else:
                        stack.append(v)
            elif isinstance(obj, list):
                stack.extend(obj)
    return sorted(set(srcs))


def save_logo(path, palette):
    size = size_for(str(path))
    bg = Image.new("RGB", size, palette[4] if len(palette) > 4 else (255, 255, 255))
    base = gradient(size, palette[0], palette[1])
    base = add_shapes(base, palette)
    base = base.filter(ImageFilter.GaussianBlur(2))
    bg.paste(base, (0, 0))
    draw = ImageDraw.Draw(bg)
    text = "Glambox"
    try:
        font = ImageFont.truetype("arial.ttf", 72)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(((size[0] - tw) / 2, (size[1] - th) / 2), text, fill=(255, 255, 255), font=font)
    bg.save(path, format="PNG", optimize=True)


def main():
    random.seed(42)
    palettes = load_palettes()
    srcs = collect_srcs()

    for src in srcs:
        rel = src.lstrip("/")
        out_path = PUBLIC / rel
        out_path.parent.mkdir(parents=True, exist_ok=True)

        if "logo" in out_path.name.lower() and out_path.suffix.lower() == ".png":
            save_logo(out_path, palettes.get("hair", [hex_to_rgb(c) for c in DEFAULT_PALETTE]))
            continue

        popup_key = None
        for key in palettes.keys():
            if f"/{key}/" in src:
                popup_key = key
                break
        palette = palettes.get(popup_key, [hex_to_rgb(c) for c in DEFAULT_PALETTE])

        size = size_for(src)
        img = gradient(size, palette[0], palette[1])
        img = add_shapes(img, palette)
        img = add_noise(img)
        img.save(out_path, format="JPEG", quality=90, optimize=True)


if __name__ == "__main__":
    main()
