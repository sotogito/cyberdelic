// emample_2 모듈화 버전
// 목표:
// - "반복(iteration) 엔진"
// - "트랩(trap) 함수"
// - "색 매핑(color mapping)"
// - "픽셀 렌더러(renderer)"
// 를 분리해 재사용하기 쉽게 구성

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

// 1) 반복 엔진: z <- z^2 + c
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

// 2) 트랩 함수들: 원하는 모양 기준으로 거리 계산
const traps = {
  circleRing(z, radius = 1.0) {
    // 반지름 radius 원 둘레까지 거리
    return abs(z.norm() - radius);
  },
  point(z, px = 0, py = 0) {
    const dx = z.re - px;
    const dy = z.im - py;
    return sqrt(dx * dx + dy * dy);
  },
  lineY0(z) {
    return abs(z.im);
  }
};

// 3) 색 매핑: trap 점수 -> 픽셀 밝기
function mapTrapToGray(score, visibleRange, maxScore) {
  if (score >= maxScore) return 0;
  return 255 - map(score, 0, visibleRange, 0, 255);
}

// 4) 픽셀 하나 점수 계산기
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

// 5) 공통 렌더러: 위 모듈들을 조합해 한 장 그림 생성
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

// ===== 스케치 설정 =====
let img;

// 이 블록만 바꿔도 스타일을 쉽게 바꿀 수 있음
const config = {
  canvasSize: () => windowHeight,
  viewMin: -2,
  viewMax: 2,
  initScore: 1.0,
  maxIter: 30,
  escapeRadius: 2.0,

  // emample_2 스타일: 픽셀을 c로 사용, z0는 0
  getPixelAsC: (x, y) => cpx(x, y),
  getInitialZ: () => cpx(0, 0),

  // 링(도넛) 트랩
  trapFn: (z) => traps.circleRing(z, 1.0),

  // trap 점수를 밝기로 변환
  scoreToGray: (score) => mapTrapToGray(score, 0.06, 1.0)
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
