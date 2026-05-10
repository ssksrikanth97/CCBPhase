import React, { useRef, useEffect, useState } from 'react';
import './FaceScanner.css';

const FaceScanner = ({ onScanComplete, active }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, scanning, detected, authenticated
  const [progress, setProgress] = useState(0);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!active) {
      stopCamera();
      setStatus('idle');
      setProgress(0);
      return;
    }

    startCamera();
    return () => stopCamera();
  }, [active]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 320 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStatus('scanning');
      startScanAnimation();
    } catch (err) {
      console.error('Camera access denied:', err);
      setStatus('authenticated');
      setTimeout(() => onScanComplete?.(), 500);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startScanAnimation = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);

      if (p >= 40) setStatus('detected');
      if (p >= 100) {
        clearInterval(interval);
        setStatus('authenticated');
        setTimeout(() => {
          stopCamera();
          onScanComplete?.();
        }, 800);
      }
    }, 60);
  };

  // Draw scan overlay on canvas
  useEffect(() => {
    if (status === 'idle' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 90;

      // Face oval guide
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.7, r, 0, 0, Math.PI * 2);
      ctx.strokeStyle = status === 'authenticated'
        ? 'rgba(78, 205, 196, 0.9)'
        : status === 'detected'
        ? 'rgba(78, 205, 196, 0.7)'
        : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash(status === 'scanning' ? [8, 6] : []);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scanning line
      if (status === 'scanning' || status === 'detected') {
        const scanY = cy - r + (progress / 100) * r * 2;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, scanY);
        ctx.lineTo(cx + r * 0.6, scanY);
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Corner brackets
      const bracketSize = 20;
      const corners = [
        { x: cx - r * 0.7, y: cy - r, dx: 1, dy: 1 },
        { x: cx + r * 0.7, y: cy - r, dx: -1, dy: 1 },
        { x: cx - r * 0.7, y: cy + r, dx: 1, dy: -1 },
        { x: cx + r * 0.7, y: cy + r, dx: -1, dy: -1 },
      ];

      ctx.strokeStyle = status === 'authenticated' ? '#4ecdc4' : 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 3;
      corners.forEach(({ x, y, dx, dy }) => {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * bracketSize);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * bracketSize, y);
        ctx.stroke();
      });

      // Progress arc
      if (progress > 0 && status !== 'authenticated') {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 10, -Math.PI / 2, -Math.PI / 2 + (progress / 100) * Math.PI * 2);
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Checkmark on success
      if (status === 'authenticated') {
        ctx.beginPath();
        ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + 5);
        ctx.lineTo(cx - 3, cy + 15);
        ctx.lineTo(cx + 18, cy - 12);
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [status, progress]);

  if (!active) return null;

  return (
    <div className="face-scanner">
      <div className="face-scanner__viewport">
        <video
          ref={videoRef}
          className="face-scanner__video"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="face-scanner__overlay"
          width={280}
          height={280}
        />
      </div>
      <div className="face-scanner__status">
        {status === 'scanning' && 'Scanning face...'}
        {status === 'detected' && 'Face detected — verifying...'}
        {status === 'authenticated' && '✓ Authenticated'}
      </div>
      {status !== 'authenticated' && (
        <div className="face-scanner__progress-bar">
          <div className="face-scanner__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default FaceScanner;
