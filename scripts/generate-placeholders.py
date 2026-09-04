"""
Before / After 및 썸네일용 플레이스홀더 이미지를 생성한다.

실제 이미지가 준비되면 public/images 아래의 같은 이름 파일을 덮어쓰면 되고,
이 스크립트를 다시 실행할 필요는 없다.

    python3 scripts/generate-placeholders.py
"""

import os
import random
from PIL import Image, ImageDraw, ImageFont

W, H = 800, 600
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "images")

CATEGORIES = {
    "camera": ["eye-level", "wide-angle", "low-angle", "aerial"],
    "style": ["minimalism", "brutalism", "modern"],
    "material": ["exposed-concrete", "red-brick", "glass"],
    "lighting": ["golden-hour", "overcast", "night"],
    "environment": ["urban", "nature", "minimal"],
    "rendering": ["photorealistic", "competition", "conceptual"],
    "diagram-type": ["program", "circulation", "massing"],
    "linework": ["axonometric", "flat-vector", "hand-drawn"],
    "color-scheme": ["monochrome", "muted-pastel", "high-contrast"],
}

IMAGE_TYPES = ["perspective", "aerial", "section", "site-plan", "diagram", "concept"]

# before 는 색이 빠진 밋밋한 상태, after 는 대비가 살아난 상태로 구분되게 그린다.
BEFORE_PALETTE = {"sky": (232, 232, 228), "far": (206, 206, 200), "near": (184, 184, 178), "ground": (170, 170, 164)}
AFTER_PALETTE = {"sky": (214, 214, 208), "far": (166, 166, 158), "near": (120, 120, 114), "ground": (92, 92, 88)}


def load_font(size):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_scene(name, palette, seed):
    """추상적인 건축 매스로 구성한 플레이스홀더 장면."""
    rng = random.Random(seed)
    img = Image.new("RGB", (W, H), palette["sky"])
    d = ImageDraw.Draw(img)

    horizon = int(H * 0.72)

    # 뒤쪽 매스
    x = -40
    while x < W + 40:
        w = rng.randint(70, 150)
        h = rng.randint(90, 230)
        d.rectangle([x, horizon - h, x + w, horizon], fill=palette["far"])
        x += w + rng.randint(6, 22)

    # 앞쪽 주 매스
    main_w = rng.randint(260, 360)
    main_h = rng.randint(200, 300)
    main_x = rng.randint(60, max(61, W - main_w - 60))
    d.rectangle([main_x, horizon - main_h, main_x + main_w, horizon], fill=palette["near"])

    # 개구부 그리드
    cols, rows = rng.randint(3, 5), rng.randint(3, 5)
    pad = 26
    cw = (main_w - pad * 2) / cols
    ch = (main_h - pad * 2) / rows
    for c in range(cols):
        for r in range(rows):
            x0 = main_x + pad + c * cw + 5
            y0 = horizon - main_h + pad + r * ch + 5
            d.rectangle([x0, y0, x0 + cw - 14, y0 + ch - 14], fill=palette["sky"])

    # 지면
    d.rectangle([0, horizon, W, H], fill=palette["ground"])

    # 라벨
    font = load_font(19)
    small = load_font(14)
    d.text((32, H - 62), name.upper(), fill=(255, 255, 255), font=font)
    d.text((32, H - 34), "PLACEHOLDER — replace this file", fill=(255, 255, 255), font=small)

    return img


def save(img, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "JPEG", quality=78, optimize=True)


def main():
    count = 0

    for category_id, option_ids in CATEGORIES.items():
        for option_id in option_ids:
            seed = f"{category_id}-{option_id}"
            base = os.path.join(ROOT, "options", seed)
            save(draw_scene(f"{option_id} / before", BEFORE_PALETTE, seed + "-b"), f"{base}-before.jpg")
            save(draw_scene(f"{option_id} / after", AFTER_PALETTE, seed + "-a"), f"{base}-after.jpg")
            count += 2

    for type_id in IMAGE_TYPES:
        save(draw_scene(type_id, AFTER_PALETTE, type_id), os.path.join(ROOT, "types", f"{type_id}.jpg"))
        count += 1

    print(f"generated {count} placeholder images under public/images")


if __name__ == "__main__":
    main()
