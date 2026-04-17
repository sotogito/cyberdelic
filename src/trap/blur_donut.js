function setup() {
    createCanvas(500, 500);
    pixelDensity(1);
    noLoop();
  }
  
  function trapDonut(x, y, cx, cy, r) {
    return abs(dist(x, y, cx, cy) - r);
  }
  
  function smoothstep(edge0, edge1, x) {
    let t = constrain((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }
  
  
  function draw() {
    background(255);
    loadPixels();
  
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        let x = map(px, 0, width, -2, 2);
        let y = map(py, 0, height, -2, 2);
  
        let t = trapDonut(x, y, 0, 0, 1.0);
  
        let s = smoothstep(0.0, 0.5, t);
        let b = 255 * s;
  
        let idx = 4 * (py * width + px);
        pixels[idx + 0] = b;
        pixels[idx + 1] = b;
        pixels[idx + 2] = b;
        pixels[idx + 3] = 255;
      }
    }
  
    updatePixels();
  }

  /**
   * 특정 하나의 트랩 좌표를 기준으로 하지 않음
   * 1. 현재 좌표가 중심(0,0)에서 얼마나 떨어졌는가
   * 2. 그 거리를 반지름 r로 설정하여 그 것을 또 트랙으로 하여 블러처리
   */
