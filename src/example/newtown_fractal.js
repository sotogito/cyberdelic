let img, currentCol = 0;

function setup() {
  createCanvas(windowHeight, windowHeight);
  img = createImage(windowHeight, windowHeight);
  img.loadPixels();
}

function newton(zr, zi) {
  for (let i = 0; i < 60; i++) {
    const r2 = zr * zr + zi * zi;
    if (r2 < 1e-10) return [0, 60];
    const nr = zr - (zr*zr*zr - 3*zr*zi*zi - 1) / (3 * r2);
    const ni = zi - (3*zr*zr*zi - zi*zi*zi)       / (3 * r2);
    zr = nr; zi = ni;
    const roots = [[1,0], [-0.5, 0.866], [-0.5, -0.866]];
    for (let k = 0; k < 3; k++) {
      const dr = zr - roots[k][0];
      const di = zi - roots[k][1];
      if (dr*dr + di*di < 1e-6) return [k, i];
    }
  }
  return [0, 60];
}

function draw() {
  const COLS = 10;
  const palette = [[255,80,80], [80,255,80], [80,80,255]];
  for (let di = 0; di < COLS; di++) {
    const i = currentCol + di;
    if (i >= img.width) break;
    for (let j = 0; j < img.height; j++) {
      const px = map(i, 0, img.width, -2, 2);
      const py = map(j, 0, img.height, -2, 2);
      const [root, iter] = newton(px, py);
      const bright = map(iter, 0, 60, 255, 30);
      const idx = 4 * (i + j * img.width);
      img.pixels[idx]     = palette[root][0] * bright / 255;
      img.pixels[idx + 1] = palette[root][1] * bright / 255;
      img.pixels[idx + 2] = palette[root][2] * bright / 255;
      img.pixels[idx + 3] = 255;
    }
  }
  currentCol += COLS;
  img.updatePixels();
  image(img, 0, 0);
  if (currentCol >= img.width) noLoop();
}
