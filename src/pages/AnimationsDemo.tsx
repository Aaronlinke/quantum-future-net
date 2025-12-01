import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const AnimationsDemo = () => {
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const copyToClipboard = (className: string) => {
    navigator.clipboard.writeText(className);
    setCopiedClass(className);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedClass(null), 2000);
  };

  const animations = [
    {
      category: 'Text Effects',
      items: [
        { name: 'Gradient Text', class: 'text-gradient', demo: <span className="text-gradient text-4xl font-bold">Gradient Text</span> },
        { name: 'Animated Gradient', class: 'text-gradient-animated', demo: <span className="text-gradient-animated text-4xl font-bold">Animated Gradient</span> },
        { name: 'Shimmer Effect', class: 'text-shimmer', demo: <span className="text-shimmer text-4xl font-bold">Shimmer Effect</span> },
        { name: 'Neon Glow', class: 'neon-text', demo: <span className="neon-text text-4xl font-bold">Neon Glow</span> },
      ]
    },
    {
      category: 'Border & Glow Effects',
      items: [
        { name: 'Glow Border', class: 'glow-border', demo: <div className="glow-border p-6 rounded-lg">Glow Border</div> },
        { name: 'Animated Glow', class: 'glow-border-animated', demo: <div className="glow-border-animated p-6 rounded-lg">Animated Glow</div> },
        { name: 'Neon Border', class: 'neon-border', demo: <div className="neon-border p-6 rounded-lg">Neon Border</div> },
      ]
    },
    {
      category: 'Glass Effects',
      items: [
        { name: 'Frosted Glass', class: 'frosted-glass', demo: <div className="frosted-glass p-6 rounded-lg">Frosted Glass</div> },
        { name: 'Glass', class: 'glass', demo: <div className="glass p-6 rounded-lg">Glass Effect</div> },
        { name: 'Glass Hover', class: 'glass-hover', demo: <div className="glass-hover p-6 rounded-lg">Glass Hover</div> },
      ]
    },
    {
      category: 'Gradients',
      items: [
        { name: 'Gradient Background', class: 'gradient-bg', demo: <div className="gradient-bg p-6 rounded-lg text-white">Gradient BG</div> },
        { name: 'Animated Gradient', class: 'gradient-bg-animated', demo: <div className="gradient-bg-animated p-6 rounded-lg text-white">Animated BG</div> },
      ]
    },
    {
      category: 'Hover Effects',
      items: [
        { name: 'Scale Hover', class: 'hover-scale', demo: <Button className="hover-scale">Scale Hover</Button> },
        { name: 'Lift Hover', class: 'hover-lift', demo: <Button className="hover-lift">Lift Hover</Button> },
        { name: 'Glow Hover', class: 'hover-glow', demo: <Button className="hover-glow">Glow Hover</Button> },
      ]
    },
    {
      category: 'Entrance Animations',
      items: [
        { name: 'Fade In', class: 'animate-fade-in', demo: <div className="animate-fade-in p-4 glass rounded-lg">Fade In</div> },
        { name: 'Slide In', class: 'animate-slide-in-right', demo: <div className="animate-slide-in-right p-4 glass rounded-lg">Slide In</div> },
        { name: 'Scale In', class: 'animate-scale-in', demo: <div className="animate-scale-in p-4 glass rounded-lg">Scale In</div> },
        { name: 'Bounce In', class: 'animate-bounce-in', demo: <div className="animate-bounce-in p-4 glass rounded-lg">Bounce In</div> },
      ]
    },
    {
      category: 'Continuous Animations',
      items: [
        { name: 'Shimmer', class: 'animate-shimmer', demo: <div className="animate-shimmer gradient-bg p-4 rounded-lg text-white">Shimmer</div> },
        { name: 'Float', class: 'animate-float', demo: <div className="animate-float p-4 glass rounded-lg">Float</div> },
        { name: 'Pulse Glow', class: 'animate-pulse-glow', demo: <div className="animate-pulse-glow p-4 glass rounded-lg">Pulse Glow</div> },
        { name: 'Spin Slow', class: 'animate-spin-slow', demo: <div className="animate-spin-slow inline-block"><Sparkles className="w-8 h-8 text-primary" /></div> },
      ]
    },
    {
      category: 'Loading States',
      items: [
        { name: 'Skeleton Wave', class: 'animate-skeleton-wave', demo: <div className="animate-skeleton-wave h-8 w-full rounded-lg bg-muted"></div> },
        { name: 'Ping Slow', class: 'animate-ping-slow', demo: <div className="relative inline-flex"><div className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></div><div className="relative inline-flex rounded-full h-8 w-8 bg-primary"></div></div> },
      ]
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 flex items-center justify-center gap-4 text-gradient-animated">
            <Sparkles className="w-12 h-12 animate-spin-slow" />
            Animations Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Moderne Animationen und visuelle Effekte für Web 4.0
          </p>
          <Badge variant="outline" className="mt-4 text-sm">
            Click on any example to copy the CSS class
          </Badge>
        </div>

        <div className="space-y-12">
          {animations.map((category, idx) => (
            <div 
              key={category.category} 
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gradient">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card
                    key={item.name}
                    className="glass-hover p-6 cursor-pointer group relative overflow-hidden"
                    onClick={() => copyToClipboard(item.class)}
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedClass === item.class ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">{item.name}</h3>
                    
                    <div className="flex items-center justify-center min-h-[120px] mb-4">
                      {item.demo}
                    </div>
                    
                    <div className="text-center">
                      <code className="text-sm bg-muted px-3 py-1 rounded">
                        {item.class}
                      </code>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <Card className="glass p-8 mt-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Verwendung</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Klicke auf eine Animation</strong> um die CSS-Klasse zu kopieren
            </p>
            <p>
              <strong className="text-foreground">2. Füge die Klasse zu deinem Element hinzu:</strong>
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`<div className="text-gradient-animated">\n  Dein Inhalt hier\n</div>`}</code>
            </pre>
            <p>
              <strong className="text-foreground">3. Kombiniere mehrere Effekte:</strong>
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`<div className="glass-hover hover-lift glow-border-animated">\n  Kombinierte Effekte\n</div>`}</code>
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnimationsDemo;
