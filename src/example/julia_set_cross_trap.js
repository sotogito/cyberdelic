class Complex {
    constructor(re, im) { this.re = re; this.im = im || 0; }
    add(o) { return new Complex(this.re + o.re, this.im + o.im); }
    mul(o) {
      return new Complex(
        this.re * o.re - this.im * o.im,
        this.re * o.im + this.im * o.re
      );
    }
    eq(o) { return this.re === o.re && this.im === o.im; }
    norm() { return sqrt(this.re * this.re + this.im * this.im); }
  }
  function cpx(x, y) { return new Complex(x, y); }
  
  let img, currentCol = 0;
  const q0 = 1;
  
  function setup() {
    createCanvas(windowHeight, windowHeight);
    img = createImage(windowHeight, windowHeight);
    img.loadPixels();
  }
  
  function getColor(z, s) {
    let c = cpx(0.285, 0.01); // c 값 바꾸면 모양 달라짐
    for (let i = 0; i < 60; i++) {
      z = c.add(z.mul(z));
      if (z.norm() > 2) return s;
      // 십자가 올가미: x축, y축에 가까울수록 포착
      s = min(s, min(abs(z.re), abs(z.im)));
    }
    return s;
  }
  
  function draw() {
    const COLS = 10;
    for (let di = 0; di < COLS; di++) {
      const i = currentCol + di;
      if (i >= img.width) break;
      for (let j = 0; j < img.height; j++) {
        const px = map(i, 0, img.width, -2, 2);
        const py = map(j, 0, img.height, -2, 2);
        const c = getColor(cpx(px, py), q0);
        let val = 0;
        if (c < q0) val = constrain(255 - sq(map(c, 0, 0.02, 0, 200)), 0, 255);
        const idx = 4 * (i + j * img.width);
        img.pixels[idx] = val;
        img.pixels[idx+1] = val * 0.5; // 파란빛 컬러
        img.pixels[idx+2] = val;
        img.pixels[idx+3] = 255;
      }
    }
    currentCol += COLS;
    img.updatePixels();
    image(img, 0, 0);
    if (currentCol >= img.width) noLoop();
  }
  