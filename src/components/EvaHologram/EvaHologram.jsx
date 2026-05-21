import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const EvaHologram = ({ isListening, isSpeaking, isProcessing, onClick }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 400;
    const height = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Outer network sphere ---
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: 0x0099ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
    );
    scene.add(outerWire);

    // Vertex glow points on outer sphere
    const verts = outerGeo.attributes.position;
    const vCount = verts.count;
    const vPos = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      vPos[i * 3] = verts.getX(i);
      vPos[i * 3 + 1] = verts.getY(i);
      vPos[i * 3 + 2] = verts.getZ(i);
    }
    const vGeo = new THREE.BufferGeometry();
    vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3));
    const vMat = new THREE.PointsMaterial({ color: 0x44ddff, size: 0.07, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const vPoints = new THREE.Points(vGeo, vMat);
    scene.add(vPoints);

    // --- Inner energy core ---
    const coreGeo = new THREE.IcosahedronGeometry(0.5, 3);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00eeff, wireframe: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Core glow
    const coreGlowGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const coreGlowMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    scene.add(coreGlow);

    // --- Inner particles (dense cloud) ---
    const innerCount = 250;
    const innerPos = new Float32Array(innerCount * 3);
    for (let i = 0; i < innerCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 1.2;
      innerPos[i * 3] = Math.sin(p) * Math.cos(t) * r;
      innerPos[i * 3 + 1] = Math.cos(p) * r;
      innerPos[i * 3 + 2] = Math.sin(p) * Math.sin(t) * r;
    }
    const innerGeo = new THREE.BufferGeometry();
    innerGeo.setAttribute('position', new THREE.BufferAttribute(innerPos, 3));
    const innerMat = new THREE.PointsMaterial({ color: 0x88eeff, size: 0.025, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const innerParticles = new THREE.Points(innerGeo, innerMat);
    scene.add(innerParticles);

    // --- Sweeping arcs ---
    const arcs = [];
    for (let i = 0; i < 4; i++) {
      const arcGeo = new THREE.TorusGeometry(1.7 + i * 0.12, 0.006, 8, 128, Math.PI * (0.5 + Math.random() * 0.4));
      const arcMat = new THREE.MeshBasicMaterial({ color: 0x00bbff, transparent: true, opacity: 0.2 - i * 0.03, blending: THREE.AdditiveBlending });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      arcs.push(arc);
      scene.add(arc);
    }

    // --- Outer ambient particles ---
    const ambientCount = 100;
    const ambientPos = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      ambientPos[i * 3] = (Math.random() - 0.5) * 6;
      ambientPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const ambientGeo = new THREE.BufferGeometry();
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
    const ambientMat = new THREE.PointsMaterial({ color: 0x4488cc, size: 0.015, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const ambientParticles = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientParticles);

    // --- Extra vertex nodes — concentrated top, left, right ---
    const extraCount = 120;
    const extraPos = new Float32Array(extraCount * 3);
    for (let i = 0; i < extraCount; i++) {
      const region = i % 3; // 0=top, 1=left, 2=right
      let x, y, z;
      if (region === 0) { // Top cluster
        x = (Math.random() - 0.5) * 2.5;
        y = 1.5 + Math.random() * 1.5;
        z = (Math.random() - 0.5) * 2;
      } else if (region === 1) { // Left cluster
        x = -1.5 - Math.random() * 1.5;
        y = (Math.random() - 0.5) * 2.5;
        z = (Math.random() - 0.5) * 2;
      } else { // Right cluster
        x = 1.5 + Math.random() * 1.5;
        y = (Math.random() - 0.5) * 2.5;
        z = (Math.random() - 0.5) * 2;
      }
      extraPos[i * 3] = x;
      extraPos[i * 3 + 1] = y;
      extraPos[i * 3 + 2] = z;
    }
    const extraGeo = new THREE.BufferGeometry();
    extraGeo.setAttribute('position', new THREE.BufferAttribute(extraPos, 3));
    const extraMat = new THREE.PointsMaterial({ color: 0x66ccff, size: 0.035, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const extraNodes = new THREE.Points(extraGeo, extraMat);
    scene.add(extraNodes);

    // --- Connection lines between extra nodes ---
    const linePositions = [];
    for (let i = 0; i < extraCount - 1; i += 2) {
      linePositions.push(extraPos[i * 3], extraPos[i * 3 + 1], extraPos[i * 3 + 2]);
      linePositions.push(extraPos[(i + 1) * 3], extraPos[(i + 1) * 3 + 1], extraPos[(i + 1) * 3 + 2]);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2288cc, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending });
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectionLines);

    // --- Base platform rings ---
    for (let i = 0; i < 2; i++) {
      const baseRingGeo = new THREE.TorusGeometry(1.8 + i * 0.3, 0.01, 8, 64);
      const baseRingMat = new THREE.MeshBasicMaterial({ color: 0x0077cc, transparent: true, opacity: 0.15 - i * 0.04, blending: THREE.AdditiveBlending });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -1.8;
      scene.add(baseRing);
    }

    // --- Animation ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const active = isListening ? 2.5 : isSpeaking ? 1.8 : 1.0;

      // Outer sphere
      outerWire.rotation.y = t * 0.12 * active;
      outerWire.rotation.x = Math.sin(t * 0.08) * 0.15;
      vPoints.rotation.copy(outerWire.rotation);
      const pulse = 1.0 + Math.sin(t * 1.5 * active) * 0.04 * active;
      outerWire.scale.setScalar(pulse);
      vPoints.scale.setScalar(pulse);

      // Core
      core.rotation.y = -t * 0.4 * active;
      core.rotation.x = t * 0.2;
      core.scale.setScalar(0.9 + Math.sin(t * 3 * active) * 0.1 * active);
      coreGlow.scale.setScalar(1.0 + Math.sin(t * 2 * active) * 0.15 * active);
      coreGlowMat.opacity = 0.06 + Math.sin(t * 2) * 0.03 * active;

      // Inner particles
      innerParticles.rotation.y = -t * 0.2 * active;
      innerParticles.rotation.z = t * 0.1;

      // Arcs
      arcs.forEach((arc, i) => {
        arc.rotation.z = t * (0.2 + i * 0.1) * active;
        arc.rotation.x += 0.001 * active;
      });

      // Ambient particles drift
      ambientParticles.rotation.y = t * 0.02;

      // Extra nodes — gentle rotation
      extraNodes.rotation.y = t * 0.08 * active;
      extraNodes.rotation.x = Math.sin(t * 0.15) * 0.1;
      connectionLines.rotation.y = t * 0.08 * active;
      connectionLines.rotation.x = Math.sin(t * 0.15) * 0.1;
      extraMat.opacity = 0.4 + Math.sin(t * 2) * 0.15 * active;
      lineMat.opacity = 0.08 + Math.sin(t * 1.5) * 0.04 * active;

      // Vertex pulse
      vMat.opacity = 0.7 + Math.sin(t * 3 * active) * 0.2;
      vMat.size = 0.06 + Math.sin(t * 2) * 0.02 * active;

      // Color states
      if (isListening) {
        outerWire.material.color.setHex(0xff2255);
        vMat.color.setHex(0xff5577);
        coreMat.color.setHex(0xff4466);
        coreGlowMat.color.setHex(0xcc1133);
        innerMat.color.setHex(0xff7799);
        arcs.forEach(a => a.material.color.setHex(0xff3366));
      } else if (isSpeaking) {
        outerWire.material.color.setHex(0x00ffaa);
        vMat.color.setHex(0x44ffcc);
        coreMat.color.setHex(0x00ffbb);
        coreGlowMat.color.setHex(0x009977);
        innerMat.color.setHex(0x66ffdd);
        arcs.forEach(a => a.material.color.setHex(0x00ffaa));
      } else {
        outerWire.material.color.setHex(0x0099ff);
        vMat.color.setHex(0x44ddff);
        coreMat.color.setHex(0x00eeff);
        coreGlowMat.color.setHex(0x0088ff);
        innerMat.color.setHex(0x88eeff);
        arcs.forEach(a => a.material.color.setHex(0x00bbff));
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isListening, isSpeaking, isProcessing]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      style={{ width: 400, height: 400, cursor: 'pointer', filter: 'drop-shadow(0 0 20px rgba(0, 150, 255, 0.3))' }}
    />
  );
};

export default EvaHologram;
