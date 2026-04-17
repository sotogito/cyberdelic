let z;
let c;
let history = [];
let scaleFactor = 140;
let maxIter = 40;
let iter = 0;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);

  /**
   * 시작점과 고정 상수를 변경하여 궤적을 변경함
   */

  // 시작점 z0
  z = { re: 0.2, im: 0.1 };
 // 고정 상수 c
  c = { re: -0.75, im: 0.11 };

  history.push({ re: z.re, im: z.im });

  frameRate(6);
}

function draw() {
  background(255); 

  drawAxes();
  drawCPoint();
  drawOrbit();

  if (iter < maxIter) {
    stepOrbit();
  } else {
    noLoop();
  }

  drawInfo();
}

function stepOrbit() {
  // z^2 + c
  let newRe = z.re * z.re - z.im * z.im + c.re;
  let newIm = 2 * z.re * z.im + c.im;

  z = { re: newRe, im: newIm };
  history.push({ re: z.re, im: z.im });
  iter++;

  // 너무 멀리 가면 종료
  let mag = sqrt(z.re * z.re + z.im * z.im);
  if (mag > 4) {
    noLoop();
  }
}

function toScreen(re, im) {
  return {
    x: width / 2 + re * scaleFactor,
    y: height / 2 - im * scaleFactor
  };
}

function drawAxes() {
  stroke(220);
  strokeWeight(1);

  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  fill(0);
  noStroke();
  text("Re", width - 30, height / 2 - 8);
  text("Im", width / 2 + 8, 20);
}

function drawCPoint() {
  let p = toScreen(c.re, c.im);

  noStroke();
  fill(0, 100, 255);
  circle(p.x, p.y, 10);

  fill(0);
  text(`c = (${nf(c.re, 1, 2)}, ${nf(c.im, 1, 2)})`, p.x + 12, p.y - 8);
}

function drawOrbit() {
  if (history.length === 0) return;

  // 궤적 선
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of history) {
    let s = toScreen(p.re, p.im);
    vertex(s.x, s.y);
  }
  endShape();

  // 지난 점들
  noStroke();
  fill(80);
  for (let i = 0; i < history.length - 1; i++) {
    let s = toScreen(history[i].re, history[i].im);
    circle(s.x, s.y, 6);
  }

  // 현재 점
  let current = history[history.length - 1];
  let cs = toScreen(current.re, current.im);
  fill(255, 0, 0);
  circle(cs.x, cs.y, 12);
}

function drawInfo() {
  fill(255);
  noStroke();
  rect(10, 10, 250, 80);

  fill(0);
  text(`iteration: ${iter}`, 20, 30);
  text(`z.re: ${nf(z.re, 1, 4)}`, 20, 50);
  text(`z.im: ${nf(z.im, 1, 4)}`, 20, 70);
  text(`|z|: ${nf(sqrt(z.re * z.re + z.im * z.im), 1, 4)}`, 20, 90);
}
