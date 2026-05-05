// example_1 모듈화 버전
// emample_2_modular.js와 같은 구조를 사용해서
// "반복 엔진은 동일, 설정(config)만 바꿔 스타일 변경"을 보여준다.

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im || 0;
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  mul(other) {
    const re = this.re * other.re - this.im * other.im;
    const im = this.re * other.im + this.im * other.re;
    return new Complex(re, im);
  }

  norm() {
    return sqrt(this.re * this.re + this.im * this.im);
  }

  equals(other) {
    return this.re === other.re && this.im === other.im;
  }
}

function cpx(re, im) {
  return new Complex(re, im);
}

function iterateQuadratic({
  initialZ,
  c,
  maxIter,
  escapeRadius,
  onStep
}) {
  let z = initialZ;

  for (let i = 0; i < maxIter; i++) {
    const next = c.add(z.mul(z));

    if (next.equals(z) || next.norm() > escapeRadius) {
      return;
    }

    z = next;
    onStep(z, i);
  }
}

function getPixelScore({
  pixelAsC,
  initialZ,
  trapFn,
  maxIter,
  escapeRadius,
  initScore
}) {
  let score = initScore;

  iterateQuadratic({
    initialZ,
    c: pixelAsC,
    maxIter,
    escapeRadius,
    onStep: (z) => {
      const t = trapFn(z);
      score = min(score, t);
    }
  });

  return score;
}

function renderFractalImage({
  img,
  viewMin,
  viewMax,
  initScore,
  maxIter,
  escapeRadius,
  getPixelAsC,
  getInitialZ,
  trapFn,
  scoreToGray
}) {
  for (let px = 0; px < img.width; px++) {
    for (let py = 0; py < img.height; py++) {
      const x = map(px, 0, img.width, viewMin, viewMax);
      const y = map(py, 0, img.height, viewMin, viewMax);

      const score = getPixelScore({
        pixelAsC: getPixelAsC(x, y),
        initialZ: getInitialZ(x, y),
        trapFn,
        maxIter,
        escapeRadius,
        initScore
      });

      const gray = constrain(scoreToGray(score), 0, 255);
      img.set(px, py, color(gray));
    }
  }
}

// example_1의 복합 trap 로직을 함수로 분리
function complexTrapForExample1(z) {
  return (
    pow(sq(z.re) + sq(z.im), 0.95) *
    abs(1 - pow(sq(z.re - 0.53) + sq(z.im - 0.08), 0.15)) *
    abs(1 - pow(sq(z.re + 0.53) + sq(z.im + 0.08), 0.15))
  );
}

function scoreToGrayExample1(score) {
  // 원본 example_1의 색감에 가깝게 유지
  return 255 - sq(map(score, 0, 0.005, 0, 200));
}

let img;

const config = {
  canvasSize: () => windowHeight,
  viewMin: -2,
  viewMax: 2,
  initScore: 1.0,
  maxIter: 30,
  escapeRadius: 2.0,

  // example_1 스타일: 픽셀을 z0로 사용, c는 고정
  getPixelAsC: () => cpx(-0.8, -0.16),
  getInitialZ: (x, y) => cpx(x, y),

  trapFn: complexTrapForExample1,
  scoreToGray: scoreToGrayExample1
};

function setup() {
  const size = config.canvasSize();
  createCanvas(size, size);
  img = createImage(size, size);
  img.loadPixels();
  noLoop();
}

function draw() {
  background(0);

  renderFractalImage({
    img,
    viewMin: config.viewMin,
    viewMax: config.viewMax,
    initScore: config.initScore,
    maxIter: config.maxIter,
    escapeRadius: config.escapeRadius,
    getPixelAsC: config.getPixelAsC,
    getInitialZ: config.getInitialZ,
    trapFn: config.trapFn,
    scoreToGray: config.scoreToGray
  });

  img.updatePixels();
  image(img, 0, 0);
}
