import { useEffect, useRef } from "react";

const NetworkVisualization = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current;
    const nodes: { x: number; y: number; size: number; color: string; vx: number; vy: number }[] = [];
    
    // Create nodes
    const colors = ["hsl(192 100% 42%)", "hsl(270 65% 60%)", "hsl(82 61% 45%)", "hsl(32 100% 50%)"];
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 30 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
      });
    }

    const nodeElements = nodes.map((node, i) => {
      const el = document.createElement("div");
      el.className = "absolute rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-125 animate-pulse-glow";
      el.style.width = `${node.size}px`;
      el.style.height = `${node.size}px`;
      el.style.left = `${node.x}%`;
      el.style.top = `${node.y}%`;
      el.style.backgroundColor = node.color;
      el.style.boxShadow = `0 0 20px ${node.color}`;
      el.style.animationDelay = `${i * 0.2}s`;
      el.textContent = String(i + 1);
      container.appendChild(el);
      return { el, node };
    });

    // Animate
    let animationFrame: number;
    const animate = () => {
      nodeElements.forEach(({ el, node }) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > 95) node.vx *= -1;
        if (node.y < 0 || node.y > 95) node.vy *= -1;
        
        el.style.left = `${node.x}%`;
        el.style.top = `${node.y}%`;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      nodeElements.forEach(({ el }) => el.remove());
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] glass rounded-2xl overflow-hidden">
      <div ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default NetworkVisualization;
