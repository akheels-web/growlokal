const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// 1. Read source logo
const logoPath = path.resolve(__dirname, '../../temp_logo.png');
const logoPng = PNG.sync.read(fs.readFileSync(logoPath));

// Icon bounding box inside logo: x: 0..122, y: 0..146 (123 x 147)
const iconWidth = 123;
const iconHeight = 147;

// Create high-res square master (160 x 160 with subtle margin or 147 x 147)
const squareSize = Math.max(iconWidth, iconHeight); // 147
const masterSquare = new PNG({ width: squareSize, height: squareSize });

// Fill with transparency
masterSquare.data.fill(0);

// Center the icon horizontally
const xOffset = Math.floor((squareSize - iconWidth) / 2); // 12px
const yOffset = Math.floor((squareSize - iconHeight) / 2); // 0px

for (let y = 0; y < iconHeight; y++) {
  for (let x = 0; x < iconWidth; x++) {
    const srcIdx = (logoPng.width * y + x) << 2;
    const destIdx = (squareSize * (y + yOffset) + (x + xOffset)) << 2;

    masterSquare.data[destIdx] = logoPng.data[srcIdx];
    masterSquare.data[destIdx + 1] = logoPng.data[srcIdx + 1];
    masterSquare.data[destIdx + 2] = logoPng.data[srcIdx + 2];
    masterSquare.data[destIdx + 3] = logoPng.data[srcIdx + 3];
  }
}

// Function to resample square PNG using bilinear interpolation
function resizeSquare(src, targetSize) {
  const dest = new PNG({ width: targetSize, height: targetSize });
  dest.data.fill(0);

  const scale = src.width / targetSize;

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const srcX = x * scale;
      const srcY = y * scale;

      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, src.width - 1);
      const y1 = Math.min(y0 + 1, src.height - 1);

      const dx = srcX - x0;
      const dy = srcY - y0;

      const idx00 = (src.width * y0 + x0) << 2;
      const idx10 = (src.width * y0 + x1) << 2;
      const idx01 = (src.width * y1 + x0) << 2;
      const idx11 = (src.width * y1 + x1) << 2;

      const destIdx = (targetSize * y + x) << 2;

      for (let c = 0; c < 4; c++) {
        const top = src.data[idx00 + c] * (1 - dx) + src.data[idx10 + c] * dx;
        const bottom = src.data[idx01 + c] * (1 - dx) + src.data[idx11 + c] * dx;
        dest.data[destIdx + c] = Math.round(top * (1 - dy) + bottom * dy);
      }
    }
  }

  return dest;
}

// Target directory
const publicDir = path.resolve(__dirname, 'public');

// Generate sizes
const sizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
  const resized = resizeSquare(masterSquare, size);
  const buffer = PNG.sync.write(resized);
  fs.writeFileSync(path.join(publicDir, name), buffer);
  console.log(`Generated ${name} (${size}x${size})`);
}

// Also write favicon.ico (using 32x32 PNG buffer)
const icon32 = PNG.sync.write(resizeSquare(masterSquare, 32));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icon32);
console.log('Generated favicon.ico (32x32)');
