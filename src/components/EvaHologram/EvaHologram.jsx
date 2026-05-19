import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const EvaHologram = ({ isListening, isSpeaking, isProcessing, onClick }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 360;
    const height = 360;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Outer wireframe sphere (network mesh) ---
    const outerGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const outerWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.35 })
    );
    scene.add(outerWire);

    // Glowing vertices on outer sphere
    const outerVertices = outerGeo.attributes.position;
    const vertexCount = outerVertices.count;
    const vertexPositions = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      vertexPositions[i * 3] = outerVertices.getX(i);
      vertexPositions[i * 3 + 1] = outerVertices.getY(i);
      vertexPositions[i * 3 + 2] = outerVertices.getZ(i);
    }
    const vertexGeo = new THREE.BufferGeometry();
    vertexGeo.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));
    const vertexMat = new THREE.PointsMaterial({
      color: 0x44ddff,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const vertexPoints = new THREE.Points(vertexGeo, vertexMat);
    scene.add(vertexPoints);

    // --- Inner particle cloud (bright dots inside) ---
    const innerCount = 150;
    const innerPositions = new Float32Array(innerCount * 3);
    for (let i = 0; i < innerCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 1.0;
      innerPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      innerPositions[i * 3 + 1] = Math.cos(phi) * r;
      innerPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const innerGeo = new THREE.BufferGeometry();
    innerGeo.setAttribute('position', new THREE.BufferAttribute(innerPositions, 3));
    const innerMat = new THREE.PointsMaterial({
      color: 0x66eeff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const innerParticles = new THREE.Points(innerGeo, innerMat);
    scene.add(innerParticles);

    // --- Sweeping light arcs (torus rings) ---
    const arcs = [];
    for (let i = 0; i < 3; i++) {
      const arcGeo = new THREE.TorusGeometry(1.6 + i * 0.15, 0.008, 8, 100, Math.PI * 0.7);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.25 - i * 0.05,
        blending: THREE.AdditiveBlending,
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.x = Math.random() * Math.PI;
      arc.rotation.y = Math.random() * Math.PI;
      arcs.push(arc);
      scene.add(arc);
    }

    // --- Glow sphere (soft inner glow) ---
    const glowGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // --- Animation ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const active = isListening ? 2.2 : isSpeaking ? 1.6 : 1.0;

      // Rotate outer wireframe
      outerWire.rotation.y = t * 0.15 * active;
      outerWire.rotation.x = Math.sin(t * 0.1) * 0.2;
      vertexPoints.rotation.y = t * 0.15 * active;
      vertexPoints.rotation.x = Math.sin(t * 0.1) * 0.2;

      // Pulse outer wireframe
      const pulse = 1.0 + Math.sin(t * 1.5 * active) * 0.03 * active;
      outerWire.scale.setScalar(pulse);
      vertexPoints.scale.setScalar(pulse);

      // Inner particles — rotate faster
      innerParticles.rotation.y = -t * 0.3 * active;
      innerParticles.rotation.x = t * 0.15;

      // Arcs — sweep around
      arcs.forEach((arc, i) => {
        arc.rotation.z = t * (0.3 + i * 0.15) * active;
        arc.rotation.x += 0.002 * active;
      });

      // Glow pulse
      glow.scale.setScalar(1.0 + Math.sin(t * 2 * active) * 0.08 * active);
      glowMat.opacity = 0.04 + Math.sin(t * 2) * 0.02 * active;

      // Vertex brightness pulse
      vertexMat.opacity = 0.7 + Math.sin(t * 3 * active) * 0.2;
      vertexMat.size = 0.05 + Math.sin(t * 2) * 0.015 * active;

      // Color shift when listening
      if (isListening) {
        outerWire.material.color.setHex(0xff3355);
        vertexMat.color.setHex(0xff6688);
        innerMat.color.setHex(0xff8899);
        arcs.forEach(a => a.material.color.setHex(0xff4466));
        glowMat.color.setHex(0xcc2244);
      } else if (isSpeaking) {
        outerWire.material.color.setHex(0x00ffcc);
        vertexMat.color.setHex(0x44ffdd);
        innerMat.color.setHex(0x66ffee);
        arcs.forEach(a => a.material.color.setHex(0x00ffbb));
        glowMat.color.setHex(0x009988);
      } else {
        outerWire.material.color.setHex(0x00aaff);
        vertexMat.color.setHex(0x44ddff);
        innerMat.color.setHex(0x66eeff);
        arcs.forEach(a => a.material.color.setHex(0x00ccff));
        glowMat.color.setHex(0x0088cc);
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
      style={{ width: 360, height: 360, cursor: 'pointer' }}
    />
  );
};

export default EvaHologram;
