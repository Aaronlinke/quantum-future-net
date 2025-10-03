import { useEffect, useRef, useState } from "react";

const NetworkVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ["hsl(192 100% 42%)", "hsl(270 65% 60%)", "hsl(82 61% 45%)", "hsl(32 100% 50%)"];

    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setNodeCount(nodes.length);

    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = "rgba(13, 13, 26, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((other, j) => {
          if (i < j) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.strokeStyle = `hsla(192, 100%, 42%, ${0.3 * (1 - distance / 150)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        // Draw node
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative w-full h-[400px] glass rounded-2xl overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full backdrop-blur">
        {nodeCount} Knoten aktiv
      </div>
    </div>
  );
};

export default NetworkVisualization;
