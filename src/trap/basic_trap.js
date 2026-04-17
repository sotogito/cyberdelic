function setup() { // 캔버스 초기화
    createCanvas(500, 500);
    pixelDensity(1);
    noLoop();
}
  
/**
 * 점 트랩
 */
function trapPoint(x, y, cx, cy) { // 트랩 함수 정의
    return dist(x, y, cx, cy);
}

/**
 * 원 트랩
 * 
 * let t = trapCircle(x, y, 0, 0, 1.0); // 반지름 1인 원 둘레
 */
function trapCircle(x, y, cx, cy, r) {
  let d = dist(x, y, cx, cy);
  return abs(d - r);
}

/**
 * 선 트랩
 */
function trapLine(x, y) {
  return abs(y); // y=0 직선까지 거리
}

  
function draw() { // 실행 함수
    background(0);
    loadPixels(); // 픽셀 데이터 로드
  
    for (let py = 0; py < height; py++) { // 픽셀 반복 : 설정한 캔버스 크기만큼의 좌표를 반복 ex) (-500,500)
      for (let px = 0; px < width; px++) { // 픽셀 반복
        let x = map(px, 0, width, -2, 2); // 픽셀 좌표를 수학적 좌표로 변환 - 픽셀 좌표를 -2,2 사이의 값으로 매핑
        let y = map(py, 0, height, -2, 2); // (-2,2)는 계산할 수학 평면의 관측 범위. 절대값이 커지면 더 큰 프랙탈 패턴을 볼 수 있다.
        // -> 캔버스를 순회하며 픽셀 좌표를 수학적 좌표로 변환
  
        let t = trapPoint(x, y, 0, 0); // 트랩 함수 호출 : 현재 픽셀 좌표와 원점(0,0) 사이의 거리를 계산
        let b = 255 - constrain(map(t, 0, 2.5, 255, 0), 0, 255); // 거리를 2.5로 나누고, 0~255 사이의 값으로 매핑
  
        let idx = 4 * (py * width + px); // 픽셀 인덱스 계산 : 픽셀 좌표를 인덱스로 변환
        pixels[idx + 0] = b; // 픽셀 색상 설정 : 픽셀 인덱스를 사용하여 픽셀 색상을 설정
        pixels[idx + 1] = b; // 픽셀 색상 설정 : 픽셀 인덱스를 사용하여 픽셀 색상을 설정
        pixels[idx + 2] = b; // 픽셀 색상 설정 : 픽셀 인덱스를 사용하여 픽셀 색상을 설정
        pixels[idx + 3] = 255; // 픽셀 색상 설정 : 픽셀 인덱스를 사용하여 픽셀 색상을 설정
      }
    }
  
    updatePixels();
}


/**
 * # 픽셀 좌표와 수학적 좌표
 * - 픽셀 좌표: 화면(캔버스)의 칸 위치 (px, py)
 *      단위: 픽셀
 *      범위: 0 ~ width-1, 0 ~ height-1
 *      목적: “어디에 그릴지”
 * 
 * - 수학적 좌표: 계산용 좌표 (x, y)
 *      단위: 네가 정한 수학 범위(예: -2 ~ 2)
 *      목적: “무슨 값을 계산할지” (프랙탈 함수 등)
 */
