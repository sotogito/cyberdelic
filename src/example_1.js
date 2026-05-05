// 5p.js
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
  const q0 = 1;
  function setup() {
    createCanvas(windowHeight, windowHeight);
    img = createImage(windowHeight, windowHeight);
    img.loadPixels();
    noLoop();
  }
  
  /**
   * @param {p5.Vector} z
   * s
   */
  function getLastColor(z, s) {
    // <-- c -> z
    let c = cpx(-0.8, -0.16); // <-- z -> c
    for (let index = 0; index < 30; index++) {
      const newz = c.add(z.mul(z));
      if (newz.eq(z) || newz.norm() > 2) {
        return s;
      }
      z = newz;
      s = min(
        s,
        pow(sq(z.re) + sq(z.im), 0.95) *
          abs(1 - pow(sq(z.re - 0.53) + sq(z.im - 0.08), 0.15)) *
          abs(1 - pow(sq(z.re + 0.53) + sq(z.im + 0.08), 0.15))
      );
      //console.log(s)
    }
    return s;
  }
  
  function plot() {
    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {
        const px = map(i, 0, img.width, -2, 2);
        const py = map(j, 0, img.height, -2, 2);
        const c = getLastColor(cpx(px, py), q0); //  s1= q0
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

// shadertoy
/**
#ifdef GL_ES
precision mediump float;
#endif

// thanks @FabriceNeyret2
#define cmul(A,B) ( mat2( A, -(A).y, (A).x ) * (B) )  // by deMoivre formula

#define pow2(x) ((x) * (x))

#define squared_norm(x) dot((x), (x))

// Constants from the P5.js code
const float q0 = 1.0;

// The core logic, translated from P5.js's getLastColor function
float getLastColor(vec2 z, float s) {
    vec2 c = vec2(-0.8, -0.16);

    for (int index = 0; index < 30; index++) {
        vec2 newz = c + cmul(z, z);

        if (newz == z || length(newz) > 2.0) {
            return s;
        }
        z = newz;
        vec2 a = vec2(.53,.08);
        // thanks @FabriceNeyret2
        float zpow_minus = squared_norm(z-a);
        float zpow_plus = squared_norm(z+a);
        s = min(s, pow(squared_norm(z), 0.95) *
                   abs(1.0 - pow(zpow_minus, 0.15)) *
                   abs(1.0 - pow(zpow_plus, 0.15))
               );
    }
    return s;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    // thanks @FabriceNeyret2
    vec2 uv = ( 2.*fragCoord - iResolution.xy ) / iResolution.y;   //iResolution is resolution of the screen

    // Call getLastColor to get the 'c' value
    // thanks @FabriceNeyret2
    float c = getLastColor(vec2(uv.x, uv.y), q0);

    // Determine the color based on 'c'
    if (c < q0) {
        // Convert the color calculation to Shadertoy's vec3 color space (0.0-1.0 range)
        float colorValue = 255.0 - pow2(c * 40000.);
        fragColor = vec4(vec3(colorValue / 255.0), 1.0); // Alpha = 1.0
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); // Default to black if c >= q0
    }
}
 */
