// emample_2 설명 버전
// 핵심 아이디어:
// 1) 각 픽셀 좌표를 c로 사용한다.
// 2) z0 = 0 에서 시작해서 z <- z^2 + c 반복.
// 3) 반복 중 "반지름 1 원(도넛 경계)"까지 최소 거리 s를 기록.
// 4) s를 밝기로 변환해 문양을 만든다.

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im || 0;
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  mul(other) {
    // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
    const re = this.re * other.re - this.im * other.im;
    const im = this.re * other.im + this.im * other.re;
    return new Complex(re, im);
  }

  div(other) {
    const denominator = pow(other.re, 2) + pow(other.im, 2);
    const re = (this.re * other.re + this.im * other.im) / denominator;
    const im = (this.im * other.re - this.re * other.im) / denominator;
    return new Complex(re, im);
  }

  eq(other) {
    return this.im === other.im && this.re === other.re;
  }

  norm() {
    return sqrt(pow(this.re, 2) + pow(this.im, 2));
  }
}

function cpx(x, y) {
  return new Complex(x, y);
}

let img;
const q0 = 1; // trap 최소값 초기치

function setup() {
  createCanvas(windowHeight, windowHeight);
  img = createImage(windowHeight, windowHeight);
  img.loadPixels();
  noLoop(); // 정적 렌더링
}

/**
 * 픽셀 하나의 trap 누적 결과 계산
 * @param {Complex} c - 이 예제에서는 픽셀 좌표가 c가 된다.
 * @param {number} s - trap 최소값 누적 변수
 */
function getLastColor(c, s) {
  // Mandelbrot 형태: z0를 0으로 고정
  let z = cpx(0, 0);

  for (let index = 0; index < 30; index++) {
    // iteration: z <- z^2 + c
    const newz = c.add(z.mul(z));

    // 수렴/발산 정지
    if (newz.eq(z) || newz.norm() > 2) {
      return s;
    }
    z = newz;

    // trap: 반지름 1 원 둘레까지 거리
    // |z|가 1에 가까울수록 값이 작아짐
    const trapValue = abs(1 - z.norm());
    s = min(s, trapValue);
  }

  return s;
}

function plot() {
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      // 화면 좌표 -> 복소평면 좌표
      const px = map(i, 0, img.width, -2, 2);
      const py = map(j, 0, img.height, -2, 2);

      // 픽셀별 c로 시뮬레이션
      const c = getLastColor(cpx(px, py), q0, cpx(0));

      // trap 결과를 밝기로 변환
      if (c < q0) {
        img.set(i, j, color(255 - map(c, 0, 0.06, 0, 255)));
      }
    }
  }
}

function draw() {
  background(0);
  plot();
  img.updatePixels();
  image(img, 0, 0);
}
