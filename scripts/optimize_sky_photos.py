"""Baixa e otimiza as 8 fotos de céu do Unsplash que viram fundo reativo
do AtmosphericPanel. Roda uma vez (ou sempre que mudar uma foto).

Uso:
    cd backend && .venv/Scripts/python.exe ../scripts/optimize_sky_photos.py

Requisitos: Pillow (não está em requirements.txt, instalar avulso se necessário).
"""

from __future__ import annotations

import io
import urllib.request
from pathlib import Path

from PIL import Image

# slug do Unsplash -> nome do arquivo de saída (sem extensão).
# O nome deve casar com a icon_key que o backend devolve para cada condição WMO.
PHOTOS: dict[str, str] = {
    # "clear" tem duas variantes: dia e noite. O AtmosphericPanel escolhe
    # baseado em current.time vs sunrise/sunset.
    "clear-day": "UbS64eogAAU",
    "clear-night": "FdBGX44aNZM",
    "mostly-clear": "gnxb59lGU1M",
    "partly-cloudy": "kIr8e-01eAw",
    "cloudy": "Pe1Ol9oLc4o",
    "fog": "IOJE_IE1h-A",
    "rain": "MnnXMvs4cQo",
    "snow": "ffIIyc3EN58",
    "thunderstorm": "trnTvywx2Rg",
}

TARGET_WIDTH = 1920  # suficiente pra desktop em alta resolução
QUALITY = 75  # WebP a 75 dá visual indistinguível do 100 com ~3x menos peso
USER_AGENT = "Mozilla/5.0"

OUT_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public" / "sky"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for name, photo_id in PHOTOS.items():
        url = f"https://unsplash.com/photos/{photo_id}/download?force=true"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()

        img = Image.open(io.BytesIO(raw)).convert("RGB")

        original_w, original_h = img.size
        if original_w > TARGET_WIDTH:
            new_h = int(original_h * TARGET_WIDTH / original_w)
            img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)

        out_path = OUT_DIR / f"{name}.webp"
        img.save(out_path, "WEBP", quality=QUALITY, method=6)

        size_kb = out_path.stat().st_size / 1024
        w, h = img.size
        print(f"{name:14s} {original_w}x{original_h} -> {w}x{h}  {size_kb:.0f}KB")


if __name__ == "__main__":
    main()
