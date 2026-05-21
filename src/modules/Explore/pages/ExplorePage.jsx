import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useThemeContext } from '../../../styles/ThemeContext';
import { useAuth } from '../../Auth/store/authContext';
import { processQuery, speak, stopSpeaking, startListening, skillsManager, SKILLS } from '../../../services/evaAgent';
import { useMode } from '../../../store/ModeContext';
import ModeSwitch from '../../../components/ModeSwitch/ModeSwitch';
import EvaHologram from '../../../components/EvaHologram/EvaHologram';
import './ExplorePage.scss';

const ExplorePage = () => {
  const history = useHistory();
  const { colors, activeTheme } = useThemeContext();
  const { logout } = useAuth();
  const { switchMode } = useMode();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle');
  const [conversationLog, setConversationLog] = useState([]);
  const [skills, setSkills] = useState(skillsManager.getAll());
  const recognitionRef = useRef(null);

  const handleLogout = () => { logout(); history.push('/login'); };

  const handleSkillToggle = (skillId) => {
    skillsManager.toggle(skillId);
    setSkills(skillsManager.getAll());
  };

  // Handle mic button — full voice pipeline
  const handleMic = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setStatus('idle');
      return;
    }

    // First interaction — greet the user
    if (conversationLog.length === 0) {
      handleQuickCommand('hello');
      return;
    }

    setStatus('listening');
    recognitionRef.current = startListening(
      // onResult
      async (transcript) => {
        setIsListening(false);
        setStatus('processing');
        setIsProcessing(true);

        const response = await processQuery(transcript);
        setIsProcessing(false);
        setConversationLog(prev => [...prev, { user: transcript, ai: response.speech, action: response.action, target: response.target, data: response.data, time: new Date().toLocaleTimeString() }]);

        // Refresh skills UI
        setSkills(skillsManager.getAll());

        // Speak the response
        setStatus('speaking');
        speak(
          response.speech,
          () => setIsSpeaking(true),
          () => { setIsSpeaking(false); setStatus('idle'); }
        );

        // Don't auto-navigate — let user click "View" in bubble
      },
      // onEnd
      () => { setIsListening(false); if (status === 'listening') setStatus('idle'); },
      // onError
      () => { setIsListening(false); setStatus('idle'); }
    );
    setIsListening(true);
  };

  // Quick command handler (fallback for typed/clicked commands)
  const handleQuickCommand = async (text) => {
    setStatus('processing');
    setIsProcessing(true);
    const response = await processQuery(text);
    setIsProcessing(false);
    setConversationLog(prev => [...prev, { user: text, ai: response.speech, action: response.action, target: response.target, data: response.data, time: new Date().toLocaleTimeString() }]);
    // Always refresh skills UI
    setSkills(skillsManager.getAll());
    setStatus('speaking');
    speak(
      response.speech,
      () => setIsSpeaking(true),
      () => { setIsSpeaking(false); setStatus('idle'); }
    );
  };

  useEffect(() => {
    document.title = 'EV Phase - Explore';
  }, []);

  // JARVIS-style interactive animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId, w, h;

    const isRetro = activeTheme.id === 'retro';
    const glowR = isRetro ? 237 : 0, glowG = isRetro ? 121 : 180, glowB = isRetro ? 12 : 220;
    const accentR = isRetro ? 245 : 0, accentG = isRetro ? 220 : 220, accentB = isRetro ? 180 : 255;
    const particleR = isRetro ? 220 : 120, particleG = isRetro ? 170 : 220, particleB = isRetro ? 100 : 255;

    const resize = () => { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w * 2; canvas.height = h * 2; ctx.scale(2, 2); };
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
      const active = isListening ? 2.5 : isSpeaking ? 1.8 : 1.0;
      const pulseSpeed = isListening ? 3 : isSpeaking ? 2 : 0.8;

      // Background glow
      const pulseIntensity = (0.08 + Math.sin(time * pulseSpeed) * 0.06) * active;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220 * active);
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
        ctx.rotate(time * (0.15 + ring * 0.08) * active + ring * 0.7);
        ctx.scale(1, 0.35 + ring * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, 90 + ring * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${(0.12 - ring * 0.015) * active})`;
        ctx.lineWidth = 0.6 + (active - 1) * 0.4;
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

      // Sphere particles
      particles.forEach((p) => {
        p.theta += p.speed * active;
        p.pulse += 0.02 * active;
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

      // Scan line
      const scanY = (time * 40) % h;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.strokeStyle = `rgba(${glowR}, ${glowG}, ${glowB}, 0.04)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Listening ripples
      if (isListening) {
        for (let r = 0; r < 3; r++) {
          const rippleR = 50 + ((time * 80 + r * 40) % 130);
          ctx.beginPath();
          ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 * (1 - rippleR / 180)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Speaking waveform
      if (isSpeaking) {
        ctx.beginPath();
        for (let x = cx - 150; x < cx + 150; x += 2) {
          const waveY = cy + 120 + Math.sin((x - cx) * 0.04 + time * 8) * 6 * Math.sin((x - cx) * 0.01 + time * 3);
          x === cx - 150 ? ctx.moveTo(x, waveY) : ctx.lineTo(x, waveY);
        }
        ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, 0.4)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Center core dot
      const coreSize = (4 + Math.sin(time * pulseSpeed * 2) * 2) * (0.8 + active * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${0.5 + Math.sin(time * 3) * 0.3})`;
      ctx.shadowColor = `rgba(${accentR}, ${accentG}, ${accentB}, 0.8)`;
      ctx.shadowBlur = 15 * active;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [activeTheme.id, isListening, isSpeaking]);

  return (
    <div className="explore">
      {/* JARVIS-style animated full background */}
      <div className="explore__canvas-area" ref={containerRef} style={{ background: activeTheme.id === 'retro' ? 'radial-gradient(ellipse at center, #2a1a0e 0%, #1a0f06 60%, #000000 100%)' : 'radial-gradient(ellipse at center, #0a1628 0%, #050d18 60%, #000000 100%)' }}>
        <canvas ref={canvasRef} className="explore__jarvis-canvas" />

        {/* Logout button — top right */}
        <button className="explore__logout" onClick={handleLogout}>
          Logout
        </button>

        {/* Response bubble */}
        {conversationLog.length > 0 && (
          <div className="explore__response-bubble">
            <p>{conversationLog[conversationLog.length - 1].ai}</p>
            {/* Data results */}
            {conversationLog[conversationLog.length - 1].data && Array.isArray(conversationLog[conversationLog.length - 1].data) && (
              <div className="explore__response-data">
                {conversationLog[conversationLog.length - 1].data.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="explore__response-data-item">
                    <span className="explore__response-data-name">{item.name || item.title || item.id}</span>
                    <span className="explore__response-data-detail">{item.price || item.status || item.email || item.segment || ''}{item.category ? ` · ${item.category}` : ''}{item.priority ? ` · ${item.priority}` : ''}</span>
                  </div>
                ))}
              </div>
            )}
            {conversationLog[conversationLog.length - 1].target && (
              <button className="explore__response-bubble-action" onClick={() => { switchMode('hybrid'); history.push(conversationLog[conversationLog.length - 1].target); }}>
                View in Hybrid →
              </button>
            )}
            <button className="explore__response-bubble-close" onClick={() => setConversationLog([])}>✕</button>
          </div>
        )}

        {/* Welcome message */}
        <div className="explore__welcome">
          <div className="explore__welcome-greeting">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Admin</div>
          <div className="explore__welcome-msg">Welcome back to EVA System.</div>
        </div>

        {/* Holographic AI Avatar — Three.js */}
        <div className="explore__voice-center">
          <EvaHologram isListening={isListening} isSpeaking={isSpeaking} isProcessing={isProcessing} onClick={handleMic} />
          <div className="explore__voice-status">
            {status === 'listening' && 'Listening...'}
            {status === 'processing' && 'Processing...'}
            {status === 'speaking' && 'EVA is responding...'}
            {status === 'idle' && 'Tap EVA to speak'}
          </div>
        </div>

        {/* Skills connected — subtle display */}
        <div className="explore__skills">
          {skills.map((skill) => (
            <button
              key={skill.id}
              className={`explore__skill ${skill.enabled ? 'explore__skill--active' : ''}`}
              onClick={() => handleSkillToggle(skill.id)}
              title={`${skill.name}: ${skill.desc}`}
            >
              <span className="explore__skill-icon">{skill.icon}</span>
              <span className="explore__skill-name">{skill.name}</span>
              <span className="explore__skill-dot" />
            </button>
          ))}
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

        <ModeSwitch />
      </div>
    </div>
  );
};

export default ExplorePage;
