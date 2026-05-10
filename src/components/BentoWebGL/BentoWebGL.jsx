import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Animated gradient blobs
  float t = uTime * 0.3;
  vec2 p1 = vec2(0.5 + 0.3 * sin(t), 0.5 + 0.3 * cos(t * 0.7));
  vec2 p2 = vec2(0.5 + 0.3 * cos(t * 0.8), 0.5 + 0.3 * sin(t * 1.1));
  
  float d1 = length(uv - p1);
  float d2 = length(uv - p2);
  
  float blob1 = 0.02 / (d1 * d1 + 0.01);
  float blob2 = 0.015 / (d2 * d2 + 0.01);
  
  float intensity = (blob1 + blob2) * 0.08;
  intensity = clamp(intensity, 0.0, 0.4);
  
  // Subtle grid pattern
  vec2 grid = fract(uv * 8.0);
  float gridLine = smoothstep(0.02, 0.0, min(grid.x, grid.y));
  gridLine *= 0.03;
  
  vec3 col = mix(uColor1, uColor2, uv.x + 0.3 * sin(uv.y * 3.0 + t));
  col *= intensity;
  col += vec3(gridLine) * uColor1;
  
  float alpha = intensity * 0.9 + gridLine;
  fragColor = vec4(col, alpha);
}`;

export default function BentoWebGL({ color1 = [0.93, 0.47, 0.05], color2 = [0.3, 0.8, 0.77], style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.borderRadius = 'inherit';

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uColor1: { value: color1 },
        uColor2: { value: color2 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    function resize() {
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    }

    window.addEventListener('resize', resize);
    resize();

    let animId;
    const update = (t) => {
      animId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };
    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color1, color2]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit', overflow: 'hidden', ...style }} />
  );
}
