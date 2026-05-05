// 5p.js
class Complex {
    constructor(re, im) {
      this.re = re;
      this.im = im || 0;
    }
  
    add(other) {
      return new Complex(
        this.re + other.re,
        this.im + other.im
      );
    }
  
    sub(other) {
      return new Complex(
        this.re - other.re,
        this.im - other.im
      );
    }
  
    mul(other) {
      const re = this.re * other.re - this.im * other.im;
      const im = this.re * other.im + this.im * other.re;
      return new Complex(re, im);
    }
  
    div(other) {
      const denominator = pow(other.re, 2) + pow(other.im, 2);
      const re =
        (this.re * other.re + this.im * other.im) / denominator;
      const im =
        (this.im * other.re - this.re * other.im) / denominator;
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
  const q0 = 1; // ,诱捕半径为 q0
  function setup() {
    createCanvas(windowHeight, windowHeight);
    img = createImage(windowHeight, windowHeight);
    img.loadPixels();
    noLoop();
  }
  
  /**
   * @param {p5.Vector} z
   * s
   * @param {Vector} first 点#为诱捕点(或点陷阱中心),
   */
  function getLastColor(c, s, first) {
    // <-- c -> z
    let z = cpx(0, 0);
    for (let index = 0; index < 30; index++) {
      const newz = c.add(z.mul(z));
      if (newz.eq(z) || newz.norm() > 2) {
        return s;
      }
      z = newz;
      s = min(s, abs(1 - z.norm()));
    }
    return s;
  }
  
  function plot() {
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        const px = map(i, 0, img.width, -2, 2);
        const py = map(j, 0, img.height, -2, 2);
        const c = getLastColor(cpx(px, py), q0, cpx(0));
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

// shadertoy
/**
#define cmul(A,B) ( mat2( A, -(A).y, (A).x ) * (B) )  // by deMoivre formula

// The equivalent of the p5 'getLastColor' function
float getLastColor(vec2 c, float s) {
    vec2 z = vec2(0.0);

    for (int i = 0; i < 30; i++) {
        vec2 newz = c + cmul(z, z);
        if (newz == z || length(newz) > 2.0) {
            return s;
        }
        z = newz;
        s = min(s, abs(1.0 - length(z)));
    }
    return s;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from -2 to 2)
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y / .8; // Correct aspect ratio

    float q0 = 1.0;
    float colorValue = getLastColor(uv, q0);

    // Set to black if outside
    // Clamping for safety
    fragColor = vec4(
               vec3(colorValue<q0?1.-clamp(colorValue/0.06,0.,1.):0.),
               1.0);
}
 */
