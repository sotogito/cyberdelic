function setup() {
    createCanvas(300, 300);
    noLoop();
  }
  
  function draw() {
    background(0);
  
    const maxIter = 30;
  
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
  
        let cx = map(x, 0, width, -2.2, 1.2);
        let cy = map(y, 0, height, -1.7, 1.7);
  
        let zx = 0;
        let zy = 0;
  
        let score = 999;
  
        for (let i = 0; i < maxIter; i++) {
  
          let nx = zx * zx - zy * zy + cx;
          let ny = 2 * zx * zy + cy;
  
          zx = nx;
          zy = ny;
  
          let r = sqrt(zx*zx + zy*zy);
  
          let lineTrap = min(abs(zx), abs(zy));
          let pointTrap = dist(zx, zy, 0.5, 0);
  
          let trapDistance = min(lineTrap, pointTrap);
  
          score = min(score, trapDistance);
  
          if (r > 2) break;
        }
  
        let v = map(score, 0, 0.05, 255, 0);
        v = constrain(v, 0, 255);
  
        stroke(v);
        point(x, y);
      }
    }
  }
  