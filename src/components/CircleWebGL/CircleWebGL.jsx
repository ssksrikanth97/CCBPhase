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
uniform vec3 uColor;
out vec4 fragColor;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float d = length(uv);
  
  // Multiple rotating rings
  float ring1 = smoothstep(0.005, 0.0, abs(d - 0.38) - 0.002);
  float ring2 = smoothstep(0.005, 0.0, abs(d - 0.28) - 0.0015);
  float ring3 = smoothstep(0.005, 0.0, abs(d - 0.18) - 0.001);
  
  // Animated dashes on rings
  float angle = atan(uv.y, uv.x);
  float dash1 = smoothstep(0.4, 0.6, sin(angle * 12.0 + uTime * 0.5));
  float dash2 = smoothstep(0.4, 0.6, sin(angle * 8.0 - uTime * 0.7));
  float dash3 = smoothstep(0.4, 0.6, sin(angle * 16.0 + uTime * 0.3));
  
  // Glow effect
  float glow1 = 0.003 / (abs(d - 0.38) + 0.01);
  float glow2 = 0.002 / (abs(d - 0.28) + 0.01);
  float glow3 = 0.001 / (abs(d - 0.18) + 0.01);
  
  // Orbiting dots
  float dotAngle1 = uTime * 0.4;
  float dotAngle2 = uTime * -0.3 + 2.094;
  float dotAngle3 = uTime * 0.6 + 4.189;
  
  vec2 dot1Pos = vec2(cos(dotAngle1), sin(dotAngle1)) * 0.38;
  vec2 dot2Pos = vec2(cos(dotAngle2), sin(dotAngle2)) * 0.28;
  vec2 dot3Pos = vec2(cos(dotAngle3), sin(dotAngle3)) * 0.18;
  
  float dot1 = 0.004 / (length(uv - dot1Pos) + 0.002);
  float dot2 = 0.003 / (length(uv - dot2Pos) + 0.002);
  float dot3 = 0.002 / (length(uv - dot3Pos) + 0.002);
  
  float rings = ring1 * dash1 + ring2 * dash2 + ring3 * dash3;
  float glows = (glow1 + glow2 + glow3) * 0.15;
  float dots = (dot1 + dot2 + dot3) * 0.3;
  
  float alpha = rings * 0.6 + glows + dots;
  alpha = clamp(alpha, 0.0, 1.0);
  
  vec3 col = uColor * alpha;
  fragColor = vec4(col, alpha * 0.8);
}`;

export default function CircleWebGL({ color = [0.6, 0.5, 0.7] }) {
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

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uColor: { value: color },
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
  }, [color]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} ref={containerRef}>
    </div>
  );
}
