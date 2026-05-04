import satori from 'satori';
import type { FlyerData } from '../types/FlyerData';
import { FlyerTemplate } from './satoriTemplate';
import React from 'react';

const W = 1080;
const H = 1350;

// Cache loaded font buffers so we only fetch once per session
let fontCache: { inter: ArrayBuffer; oswald: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;

  const [interRes, oswaldRes] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
    ),
    fetch(
      'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs13NvgUFoZAaRliE.woff2'
    ),
  ]);

  fontCache = {
    inter: await interRes.arrayBuffer(),
    oswald: await oswaldRes.arrayBuffer(),
  };

  return fontCache;
}

/** Generate SVG string from current form data (fast — used for live preview) */
export async function generateSvg(data: Partial<FlyerData>): Promise<string> {
  const fonts = await loadFonts();

  const svg = await satori(React.createElement(FlyerTemplate, { data }), {
    width: W,
    height: H,
    fonts: [
      { name: 'Inter', data: fonts.inter, weight: 400, style: 'normal' },
      { name: 'Oswald', data: fonts.oswald, weight: 900, style: 'normal' },
    ],
  });

  return svg;
}

/** Full pipeline: SVG → PNG (resvg-wasm) → JPEG → download */
export async function generateAndDownload(data: FlyerData): Promise<void> {
  const { Resvg } = await import('@resvg/resvg-wasm');

  const svg = await generateSvg(data);

  // Rasterise SVG → PNG
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // PNG → Canvas → JPEG
  const blob = new Blob([pngBuffer as unknown as BlobPart], { type: 'image/png' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);

  const jpegBase64 = canvas.toDataURL('image/jpeg', 0.92);

  // Trigger download
  const firstName = data.fullName.split(' ')[0].toLowerCase();
  const year = new Date().getFullYear();
  const filename = `fyb-${firstName}-${year}.jpg`;

  const a = document.createElement('a');
  a.href = jpegBase64;
  a.download = filename;
  a.click();
}
