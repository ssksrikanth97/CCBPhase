import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useAuth } from '../../Auth/store/authContext';
import './ExplorePage.scss';

const infoCards = [
  { icon: '⊡', title: 'Dashboard', desc: 'Analytics & real-time metrics', path: '/dashboard' },
  { icon: '◫', title: 'Catalogue', desc: 'Manage product catalogue', path: '/catalogue/products' },
  { icon: '◎', title: 'Try Services', desc: 'Campaign management', path: '/try/services' },
  { icon: '⊟', title: 'Support', desc: 'Support & issue tracking', path: '/support/tickets' },
  { icon: '⊙', title: 'Customers', desc: 'Customer 360 view', path: '/customers/view' },
  { icon: '◎', title: 'Online Store', desc: 'Campaign management', path: '/try/services' },
];

// Random positions scattered around the viewport (avoiding center where the sphere is)
const getInitialPositions = () => [
  { x: 8, y: 12 },
  { x: 72, y: 8 },
  { x: 3, y: 55 },
  { x: 75, y: 50 },
  { x: 12, y: 82 },
  { x: 68, y: 80 },
];

const ExplorePage = () => {
  const history = useHistory();
  const { colors, activeTheme } = useThemeContext();
  const { logout } = useAuth();
  const canvasRef = useRef(null);
  const [positions, setPositions] = useState(getInitialPositions);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleLogout = () => { logout(); history.push('/login'); };

  const insightsText = 'Welcome to EVA Core. Here is your business summary. Total revenue is 127 million dollars, up 8.2 percent from last month. You have 6.8 million subscribers with 12.4 percent growth. Churn rate is at 2.4 percent, which is healthy. Customer satisfaction score is 92.7 percent. There are 24 open support tickets. Your top product is OTT Streaming Basic generating 127 million in revenue. The growth leader is Exclusive Premier with 31.2 percent subscriber growth month over month.';

  const handleVoice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(insightsText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    // Try to find a female American English voice
    const voices = window.speechSynthesis.getVoices();
    const femaleUS = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female') || v.name.includes('Zira')))
      || voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (femaleUS) utterance.voice = femaleUS;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    document.title = 'EV Phase - Explore';
    // Auto-play voice on page load
    const autoPlay = () => {
      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(insightsText);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      const femaleUS = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female') || v.name.includes('Zira')))
        || voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices.find(v => v.lang.startsWith('en'));
      if (femaleUS) utterance.voice = femaleUS;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    };
    // Voices may load async, wait for them
    if (window.speechSynthesis.getVoices().length > 0) {
      autoPlay();
    } else {
      window.speechSynthesis.onvoiceschanged = () => autoPlay();
    }
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  // Drag handlers
  const handleMouseDown = useCallback((i, e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setDragging(i);
    setDragOffset({
      x: e.clientX - (positions[i].x / 100) * rect.width,
      y: e.clientY - (positions[i].y / 100) * rect.height,
    });
  }, [positions]);

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - dragOffset.x) / rect.width) * 100;
    const newY = ((e.clientY - dragOffset.y) / rect.height) * 100;
    setPositions((prev) => prev.map((p, i) => i === dragging ? { x: Math.max(0, Math.min(85, newX)), y: Math.max(0, Math.min(88, newY)) } : p));
  }, [dragging, dragOffset]);

  const handleMouseUp = useCallback(() => { setDragging(null); }, []);

  useEffect(() => {
    if (dragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // JARVIS-style full background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    // Theme-aware colors
    const isRetro = activeTheme.id === 'retro';
    const glowR = isRetro ? 237 : 0, glowG = isRetro ? 121 : 180, glowB = isRetro ? 12 : 220;
    const accentR = isRetro ? 245 : 0, accentG = isRetro ? 220 : 220, accentB = isRetro ? 180 : 255;
    const particleR = isRetro ? 220 : 120, particleG = isRetro ? 170 : 220, particleB = isRetro ? 100 : 255;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
    };
    resize();

    // Particles — sphere surface dots
    const particles = [];
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 120 + Math.random() * 40;
      particles.push({ theta, phi, r, baseR: r, speed: (Math.random() - 0.5) * 0.008, size: Math.random() * 1.5 + 0.5, pulse: Math.random() * Math.PI * 2 });
    }

    // Data streams — vertical falling characters
    const streams = [];
    for (let i = 0; i < 15; i++) {
      streams.push({ x: Math.random() * w, y: Math.random() * h, speed: 0.5 + Math.random() * 1.5, chars: Array.from({ length: 8 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)), opacity: Math.random() * 0.3 + 0.1 });
    }

    // Scanning arcs
    const arcs = [
      { radius: 160, speed: 0.4, width: Math.PI * 0.6 },
      { radius: 130, speed: -0.3, width: Math.PI * 0.4 },
      { radius: 190, speed: 0.2, width: Math.PI * 0.8 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() * 0.001;
      const cx = w / 2;
      const cy = h / 2;

      // Background glow — pulsing
      const pulseIntensity = 0.12 + Math.sin(time * 0.8) * 0.04;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
      grd.addColorStop(0, `rgba(${glowR}, ${glowG}, ${glowB}, ${pulseIntensity})`);
      grd.addColorStop(0.4, `rgba(${glowR}, ${glowG}, ${glowB}, 0.03)`);
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${0.06 + Math.sin(time) * 0.02})`;
      ctx.lineWidth = 40;
      ctx.stroke();

      // Orbiting elliptical rings (3D perspective)
      for (let ring = 0; ring < 5; ring++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (0.15 + ring * 0.08) + ring * 0.7);
        ctx.scale(1, 0.35 + ring * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, 90 + ring * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.12 - ring * 0.015})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Scanning arcs — rotating partial arcs
      arcs.forEach((arc) => {
        const startAngle = time * arc.speed;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.arc(0, 0, arc.radius, startAngle, startAngle + arc.width);
        ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, 0.2)`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Glow at tip
        const tipX = Math.cos(startAngle + arc.width) * arc.radius;
        const tipY = Math.sin(startAngle + arc.width) * arc.radius;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, 0.6)`;
        ctx.fill();
        ctx.restore();
      });

      // Inner concentric circles — breathing
      for (let c = 0; c < 4; c++) {
        const breathe = Math.sin(time * 1.2 + c * 0.8) * 5;
        ctx.save();
        ctx.translate(cx + Math.cos(time * 0.5 + c) * 8, cy + Math.sin(time * 0.5 + c) * 6);
        ctx.beginPath();
        ctx.arc(0, 0, 18 + c * 18 + breathe, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${0.18 - c * 0.03})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.restore();
      }

      // Sphere particles — 3D projected dots
      particles.forEach((p) => {
        p.theta += p.speed;
        p.pulse += 0.02;
        const x3d = Math.sin(p.phi) * Math.cos(p.theta) * p.r;
        const y3d = Math.cos(p.phi) * p.r * 0.7;
        const z3d = Math.sin(p.phi) * Math.sin(p.theta) * p.r;
        const scale = (z3d + p.r) / (p.r * 2);
        const screenX = cx + x3d;
        const screenY = cy + y3d;
        const opacity = scale * 0.6 * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${opacity})`;
        ctx.fill();
      });

      // Data streams — falling pixel dots
      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > h) { s.y = -80; s.x = Math.random() * w; }
        s.chars.forEach((ch, ci) => {
          const dotY = s.y + ci * 12;
          if (dotY > 0 && dotY < h) {
            const dotOpacity = s.opacity * (1 - ci * 0.12);
            const dotSize = 2 - ci * 0.15;
            ctx.beginPath();
            ctx.arc(s.x, dotY, Math.max(0.5, dotSize), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${dotOpacity})`;
            ctx.shadowColor = `rgba(${glowR}, ${glowG}, ${glowB}, 0.4)`;
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });

      // Horizontal scan line
      const scanY = (time * 40) % h;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.strokeStyle = `rgba(${glowR}, ${glowG}, ${glowB}, 0.04)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center core dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4 + Math.sin(time * 3) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.6 + Math.sin(time * 3) * 0.3})`;
      ctx.shadowColor = `rgba(${accentR}, ${accentG}, ${accentB}, 0.8)`;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [activeTheme.id]);

  return (
    <div className="explore">
      {/* JARVIS-style animated full background */}
      <div className="explore__canvas-area" ref={containerRef} style={{ background: activeTheme.id === 'retro' ? 'radial-gradient(ellipse at center, #2a1a0e 0%, #1a0f06 60%, #000000 100%)' : 'radial-gradient(ellipse at center, #0a1628 0%, #050d18 60%, #000000 100%)' }}>
        <canvas ref={canvasRef} className="explore__jarvis-canvas" />

        {/* Logout button — top right */}
        <button className="explore__logout" onClick={handleLogout}>
          Logout ↗
        </button>

        {/* Voice button — top left */}
        <button className="explore__voice-btn" onClick={handleVoice}>
          {isSpeaking ? '■' : '🔊'}
        </button>

        {/* HUD overlay */}
        <div className="explore__hud">
          <div className="explore__hud-title">E · V · A &nbsp;&nbsp; CORE &nbsp;&nbsp; v2.1</div>
          <div className="explore__hud-status">
            <span className="explore__hud-status-dot" />
            
            Loading Neural Modules...
          </div>
          {/* Audio visualizer bars */}
          <div className="explore__hud-bars">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="explore__hud-bar" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>

        {/* Bottom AI Insights */}
        <div className="explore__hud-stats">
          <div className="explore__hud-stat"><span className="explore__hud-stat-value">$127M</span><span className="explore__hud-stat-label">REVENUE</span></div>
          <div className="explore__hud-stat"><span className="explore__hud-stat-value">6.8M</span><span className="explore__hud-stat-label">SUBSCRIBERS</span></div>
          <div className="explore__hud-stat"><span className="explore__hud-stat-value">2.4%</span><span className="explore__hud-stat-label">CHURN RATE</span></div>
          <div className="explore__hud-stat"><span className="explore__hud-stat-value">92.7%</span><span className="explore__hud-stat-label">CSAT SCORE</span></div>
          <div className="explore__hud-stat"><span className="explore__hud-stat-value">24</span><span className="explore__hud-stat-label">OPEN TICKETS</span></div>
        </div>

        {/* Corner brackets */}
        <div className="explore__corner explore__corner--tl" />
        <div className="explore__corner explore__corner--tr" />
        <div className="explore__corner explore__corner--bl" />
        <div className="explore__corner explore__corner--br" />

        {/* Draggable floating info cards */}
        {infoCards.map((card, i) => (
          <div
            key={i}
            className={`explore__float-card ${dragging === i ? 'explore__float-card--dragging' : ''}`}
            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%`, animationDelay: `${i * 0.4}s` }}
            onMouseDown={(e) => handleMouseDown(i, e)}
            onClick={() => { if (dragging === null) history.push(card.path); }}
          >
            <div className="explore__float-card-title">{card.title}</div>
            <div className="explore__float-card-desc">{card.desc}</div>
            <div className="explore__float-card-glow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
