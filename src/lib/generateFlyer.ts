import { toJpeg } from 'html-to-image';
import type { FlyerData } from '../types/FlyerData';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Cache the css string so we only build it once
let cachedFontCSS = '';

async function getFontEmbedCSS(): Promise<string> {
  if (cachedFontCSS) return cachedFontCSS;

  const fonts = [
    { family: 'Inter', url: '/fonts/inter-400.woff', weight: 400 },
    { family: 'Inter', url: '/fonts/inter-700.woff', weight: 700 },
    { family: 'Oswald', url: '/fonts/oswald-700.woff', weight: 700 },
  ];

  const cssParts = await Promise.all(
    fonts.map(async (font) => {
      const res = await fetch(font.url);
      const buffer = await res.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      return `@font-face {
        font-family: '${font.family}';
        src: url(data:font/woff;base64,${base64}) format('woff');
        font-weight: ${font.weight};
        font-style: normal;
      }`;
    })
  );

  cachedFontCSS = cssParts.join('\n');
  return cachedFontCSS;
}

export async function generateAndDownload(
  data: FlyerData,
  elementRef: React.RefObject<HTMLDivElement | null>
): Promise<void> {
  const element = elementRef.current;
  if (!element) {
    throw new Error('Flyer element not found');
  }

  // 1. Wait for fonts and fetch manual embed CSS
  await document.fonts.ready;
  const fontEmbedCSS = await getFontEmbedCSS();

  // 2. Wait for images
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  // 3. Capture
  const dataUrl = await toJpeg(element, {
    pixelRatio: 2,
    quality: 0.95,
    fontEmbedCSS, // Bypass html-to-image buggy CSS parser!
  });

  // 4. Download
  const link = document.createElement('a');
  link.download = `FYB_${data.fullName.replace(/\s+/g, '_')}.jpg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
