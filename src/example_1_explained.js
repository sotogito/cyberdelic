// example_1 설명 버전
// 핵심 아이디어:
// 1) 각 픽셀 좌표를 복소평면 점 z0 로 본다.
// 2) z <- z^2 + c 반복(iteration)으로 궤적을 만든다.
// 3) 반복 중 trap(거리/형태 평가식) 최소값 s를 누적한다.
// 4) s를 밝기로 바꿔 픽셀 색을 결정한다.

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
    // |z| = sqrt(re^2 + im^2)
    return sqrt(pow(this.re, 2) + pow(this.im, 2));
  }
}

function cpx(x, y) {
  return new Complex(x, y);
}

let img;
const q0 = 1; // trap 최소값 초기치(최댓값처럼 사용)

function setup() {
  createCanvas(windowHeight, windowHeight);
  img = createImage(windowHeight, windowHeight);
  img.loadPixels();
  noLoop(); // 정적 이미지 한 번만 그림
}

/**
 * 픽셀 하나에 대한 "최종 trap 점수 s" 계산
 * @param {Complex} z - 이 예제에서는 픽셀에서 온 시작점
 * @param {number} s - trap 최소값 누적 변수
 */
function getLastColor(z, s) {
  // 이 예제는 c가 고정: z의 시작점을 바꿔가며 그림을 만든다.
  let c = cpx(-0.8, -0.16);

  for (let index = 0; index < 30; index++) {
    // iteration: z <- z^2 + c
    const newz = c.add(z.mul(z));

    // 수렴 정지 또는 발산(escape) 정지
    if (newz.eq(z) || newz.norm() > 2) {
      return s;
    }

    z = newz;

    // trap 평가식:
    // - 원점 근처 성분
    // - (+0.53, +0.08), (-0.53, -0.08) 주변 성분
    // 여러 항을 곱해 복합 문양을 만든다.
    const trapValue =
      pow(sq(z.re) + sq(z.im), 0.95) *
      abs(1 - pow(sq(z.re - 0.53) + sq(z.im - 0.08), 0.15)) *
      abs(1 - pow(sq(z.re + 0.53) + sq(z.im + 0.08), 0.15));

    // 반복 중 가장 "가까웠던/강했던" 순간을 저장(min trap)
    s = min(s, trapValue);
  }

  return s;
}

function plot() {
  // 모든 픽셀을 순회하며 독립 시뮬레이션 수행
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      // 화면 좌표 -> 복소평면 좌표
      const px = map(i, 0, img.width, -2, 2);
      const py = map(j, 0, img.height, -2, 2);

      // 픽셀별 trap 점수
      const c = getLastColor(cpx(px, py), q0);

      // 점수가 임계보다 작으면 색을 찍는다.
      // c가 작을수록 밝기 변화가 크게 보이게 제곱(sq) 사용
      if (c < q0) {
        img.set(i, j, color(255 - sq(map(c, 0, 0.005, 0, 200))));
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
