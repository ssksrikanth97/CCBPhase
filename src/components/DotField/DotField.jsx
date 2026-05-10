import { useEffect, useRef } from 'react';
import './DotField.css';

export default function DotField({ color = '#3d2b1f', bgColor = '#f5efe0', speed = 0.5 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const dots = [];
    const dotCount = 80;
    const maxRadius = 4;

    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        baseRadius: Math.random() * maxRadius + 1,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.0003,
        speedY: (Math.random() - 0.5) * 0.0003,
      });
    }

    function resize() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }

    function draw() {
      time += speed * 0.01;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        // Wrap around
        if (dot.x < 0) dot.x = 1;
        if (dot.x > 1) dot.x = 0;
        if (dot.y < 0) dot.y = 1;
        if (dot.y > 1) dot.y = 0;

        const pulse = Math.sin(time * 2 + dot.phase) * 0.5 + 0.5;
        const radius = dot.baseRadius * (0.6 + pulse * 0.4);
        const alpha = 0.15 + pulse * 0.25;

        const x = dot.x * canvas.width;
        const y = dot.y * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw grid dots
      const spacing = 40;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + spacing / 2;
          const y = j * spacing + spacing / 2;
          const wave = Math.sin(time + i * 0.3 + j * 0.3) * 0.5 + 0.5;

          ctx.beginPath();
          ctx.arc(x, y, 1 + wave * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.06 + wave * 0.06;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [color, bgColor, speed]);

  return (
    <div className="dotfield-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
