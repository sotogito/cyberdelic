let img, currentCol = 0;
const q0 = 1;

function setup() {
  createCanvas(windowHeight, windowHeight);
  img = createImage(windowHeight, windowHeight);
  img.loadPixels();
}

function getColor(re, im, s) {
  let zr = 0, zi = 0;
  for (let i = 0; i < 60; i++) {
    const zr2 = zr * zr - zi * zi + re;
    const zi2 = abs(2 * zr * zi) + im;
    zr = zr2; zi = zi2;
    if (zr * zr + zi * zi > 4) return s;
    s = min(s, abs(1 - sqrt(zr * zr + zi * zi)));
  }
  return s;
}

function draw() {
  const COLS = 10;
  for (let di = 0; di < COLS; di++) {
    const i = currentCol + di;
    if (i >= img.width) break;
    for (let j = 0; j < img.height; j++) {
      const px = map(i, 0, img.width, -2.5, 1.5);
      const py = map(j, 0, img.height, -2, 0.5);
      const c = getColor(px, py, q0);
      let r = 0, g = 0, b = 0;
      if (c < q0) {
        const t = constrain(map(c, 0, 0.1, 0, 1), 0, 1);
        r = constrain(255 * t * t, 0, 255);
        g = constrain(255 * t * 0.3, 0, 255);
        b = constrain(255 * (1 - t), 0, 255);
      }
      const idx = 4 * (i + j * img.width);
      img.pixels[idx]     = r;
      img.pixels[idx + 1] = g;
      img.pixels[idx + 2] = b;
      img.pixels[idx + 3] = 255;
    }
  }
  currentCol += COLS;
  img.updatePixels();
  image(img, 0, 0);
  if (currentCol >= img.width) noLoop();
}
