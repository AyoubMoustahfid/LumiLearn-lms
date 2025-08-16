import { useEffect, useRef } from "react";

type ConfettiParticle = {
  x: number;
  y: number;
  r: number;
  color: string;
  tilt: number;
  tiltAngle: number;
  tiltAngleIncrement: number;
  dx: number;
  dy: number;
};

export const useConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  const animationFrame = useRef<number | null>(null);
  const stopTimeout = useRef<NodeJS.Timeout | null>(null);

  const createParticles = (count: number) => {
    const colors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#00FF00"];
    const w = window.innerWidth;
    const h = window.innerHeight;

    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      r: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: Math.random() * Math.PI,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 3 + 2
    }));
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.current.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });
  };

  const updateParticles = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    particles.current.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += p.dy;
      p.x += p.dx;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y > h) {
        p.x = Math.random() * w;
        p.y = -10;
        p.dx = Math.random() * 2 - 1;
        p.dy = Math.random() * 3 + 2;
      }
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles(ctx);
    updateParticles();
    animationFrame.current = requestAnimationFrame(animate);
  };

  const triggerConfetti = (count = 150, duration = 3000) => {
    stopConfetti();

    createParticles(count);
    animate();

    stopTimeout.current = setTimeout(() => {
      stopConfetti();
    }, duration);
  };

  const stopConfetti = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (stopTimeout.current) {
      clearTimeout(stopTimeout.current);
      stopTimeout.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      stopConfetti();
      canvas.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { triggerConfetti };
};