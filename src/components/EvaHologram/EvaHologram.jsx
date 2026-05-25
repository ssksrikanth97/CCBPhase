import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Chromatic Aberration Shader
const ChromaticAberrationShader = {
  uniforms: { tDiffuse: { value: null }, uOffset: { value: new THREE.Vector2(0.002, 0.002) } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uOffset; varying vec2 vUv; void main() { float r = texture2D(tDiffuse, vUv + uOffset).r; float g = texture2D(tDiffuse, vUv).g; float b = texture2D(tDiffuse, vUv - uOffset).b; gl_FragColor = vec4(r, g, b, 1.0); }`,
};

const EvaHologram = ({ isListening, isSpeaking, isProcessing, onClick }) => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // --- Post-processing ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Bloom — disabled (too heavy)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.0, 1.0, 1.0);
    bloomPass.enabled = false;
    composer.addPass(bloomPass);

    // Chromatic Aberration
    const chromaPass = new ShaderPass(ChromaticAberrationShader);
    composer.addPass(chromaPass);

    // --- Scene objects ---
    // Outer network sphere (high detail)
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 3);
    const outerWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: 0x0099ff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    scene.add(outerWire);

    // Vertex nodes
    const verts = outerGeo.attributes.position;
    const vPos = new Float32Array(verts.count * 3);
    for (let i = 0; i < verts.count; i++) { vPos[i*3] = verts.getX(i); vPos[i*3+1] = verts.getY(i); vPos[i*3+2] = verts.getZ(i); }
    const vGeo = new THREE.BufferGeometry();
    vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
    const vMat = new THREE.PointsMaterial({ color: 0xccffff, size: 0.03, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending });
    const vPoints = new THREE.Points(vGeo, vMat);
    scene.add(vPoints);

    // Inner core
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 3);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00eeff, wireframe: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Core glow
    const coreGlowGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreGlowMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending });
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    scene.add(coreGlow);

    // Inner particles
    const innerCount = 80;
    const innerPos = new Float32Array(innerCount * 3);
    for (let i = 0; i < innerCount; i++) { const t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1), r=Math.random()*1.3; innerPos[i*3]=Math.sin(p)*Math.cos(t)*r; innerPos[i*3+1]=Math.cos(p)*r; innerPos[i*3+2]=Math.sin(p)*Math.sin(t)*r; }
    const innerGeo = new THREE.BufferGeometry();
    innerGeo.setAttribute('position', new THREE.BufferAttribute(innerPos, 3));
    const innerMat = new THREE.PointsMaterial({ color: 0xddf8ff, size: 0.015, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
    const innerParticles = new THREE.Points(innerGeo, innerMat);
    scene.add(innerParticles);

    // Sweeping arcs
    const arcs = [];
    for (let i = 0; i < 5; i++) {
      const arcGeo = new THREE.TorusGeometry(2.2 + i * 0.15, 0.005, 8, 128, Math.PI * (0.4 + Math.random() * 0.5));
      const arcMat = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.15 - i * 0.02, blending: THREE.AdditiveBlending });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      arcs.push(arc);
      scene.add(arc);
    }

    // Extended network nodes (top, left, right, scattered)
    const extraCount = 60;
    const extraPos = new Float32Array(extraCount * 3);
    for (let i = 0; i < extraCount; i++) {
      const r = i % 4;
      if (r === 0) { extraPos[i*3]=(Math.random()-0.5)*5; extraPos[i*3+1]=2+Math.random()*2.5; extraPos[i*3+2]=(Math.random()-0.5)*4; }
      else if (r === 1) { extraPos[i*3]=-2.5-Math.random()*2.5; extraPos[i*3+1]=(Math.random()-0.5)*5; extraPos[i*3+2]=(Math.random()-0.5)*4; }
      else if (r === 2) { extraPos[i*3]=2.5+Math.random()*2.5; extraPos[i*3+1]=(Math.random()-0.5)*5; extraPos[i*3+2]=(Math.random()-0.5)*4; }
      else { extraPos[i*3]=(Math.random()-0.5)*10; extraPos[i*3+1]=(Math.random()-0.5)*8; extraPos[i*3+2]=(Math.random()-0.5)*5; }
    }
    const extraGeo = new THREE.BufferGeometry();
    extraGeo.setAttribute('position', new THREE.BufferAttribute(extraPos, 3));
    const extraMat = new THREE.PointsMaterial({ color: 0xbbddff, size: 0.015, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
    const extraNodes = new THREE.Points(extraGeo, extraMat);
    scene.add(extraNodes);

    // Connection lines
    const linePos = [];
    for (let i = 0; i < extraCount - 2; i += 3) { linePos.push(extraPos[i*3],extraPos[i*3+1],extraPos[i*3+2], extraPos[(i+1)*3],extraPos[(i+1)*3+1],extraPos[(i+1)*3+2]); }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1166aa, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectionLines);

    // Resize
    const onResize = () => { const w=container.clientWidth, h=container.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); composer.setSize(w,h); };
    window.addEventListener('resize', onResize);

    // --- Hand gesture tracking removed (requires ML backend) ---
    // Mouse parallax provides the interactive 3D effect instead

    // --- Animation loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const active = isListening ? 2.5 : isSpeaking ? 1.8 : 1.0;

      // Parallax from mouse
      const px = mouseRef.current.x * 0.4;
      const py = mouseRef.current.y * 0.4;
      camera.position.x += (px - camera.position.x) * 0.05;
      camera.position.y += (py - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Bloom intensity reacts to state
      bloomPass.strength = isListening ? 0.4 : isSpeaking ? 0.3 : 0.2;
      chromaPass.uniforms.uOffset.value.set(0.001 * active, 0.001 * active);

      // Outer sphere
      outerWire.rotation.y = t * 0.1 * active;
      outerWire.rotation.x = Math.sin(t * 0.07) * 0.12;
      vPoints.rotation.copy(outerWire.rotation);
      const pulse = 1.0 + Math.sin(t * 1.5 * active) * 0.03 * active;
      outerWire.scale.setScalar(pulse);
      vPoints.scale.setScalar(pulse);

      // Core
      core.rotation.y = -t * 0.4 * active;
      core.rotation.x = t * 0.2;
      core.scale.setScalar(0.9 + Math.sin(t * 3 * active) * 0.1 * active);
      coreGlow.scale.setScalar(1.0 + Math.sin(t * 2 * active) * 0.15 * active);
      coreGlowMat.opacity = 0.05 + Math.sin(t * 2) * 0.03 * active;

      // Inner particles
      innerParticles.rotation.y = -t * 0.2 * active;
      innerParticles.rotation.z = t * 0.08;

      // Arcs
      arcs.forEach((arc, i) => { arc.rotation.z = t * (0.15 + i * 0.08) * active; arc.rotation.x += 0.001 * active; });

      // Extra nodes
      extraNodes.rotation.y = t * 0.06 * active;
      connectionLines.rotation.y = t * 0.06 * active;
      extraMat.opacity = 0.35 + Math.sin(t * 1.5) * 0.1 * active;

      // Vertex pulse
      vMat.opacity = 0.6 + Math.sin(t * 3 * active) * 0.2;
      vMat.size = 0.05 + Math.sin(t * 2) * 0.015 * active;

      // Colors
      if (isListening) {
        outerWire.material.color.setHex(0xff2255); vMat.color.setHex(0xff5577); coreMat.color.setHex(0xff4466);
        coreGlowMat.color.setHex(0xcc1133); innerMat.color.setHex(0xff7799); arcs.forEach(a => a.material.color.setHex(0xff3366));
      } else if (isSpeaking) {
        outerWire.material.color.setHex(0x00ffaa); vMat.color.setHex(0x44ffcc); coreMat.color.setHex(0x00ffbb);
        coreGlowMat.color.setHex(0x009977); innerMat.color.setHex(0x66ffdd); arcs.forEach(a => a.material.color.setHex(0x00ffaa));
      } else {
        outerWire.material.color.setHex(0x0099ff); vMat.color.setHex(0x44ddff); coreMat.color.setHex(0x00eeff);
        coreGlowMat.color.setHex(0x0088ff); innerMat.color.setHex(0x88eeff); arcs.forEach(a => a.material.color.setHex(0x00bbff));
      }

      composer.render();
      animId = requestAnimationFrame(animate);
    };
    animate();

    // Mouse listener
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isListening, isSpeaking, isProcessing, handleMouseMove]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default EvaHologram;
