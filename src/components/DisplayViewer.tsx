import { useState, useEffect, useRef } from 'react';
import { DisplayInfo, ConnectionConfig } from '../App';

interface DisplayViewerProps {
  displayInfo: DisplayInfo;
  config: ConnectionConfig;
  onDisconnect: () => void;
}

export default function DisplayViewer({ displayInfo, config, onDisconnect }: DisplayViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // Simulate a desktop display
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const animate = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Draw desktop background gradient
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Draw grid pattern
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw animated desktop elements
      // Taskbar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, h - 48, w, 48);
      ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.fillRect(0, h - 48, w, 1);

      // Start button
      const startBtnX = 12;
      const startBtnY = h - 40;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.beginPath();
      ctx.roundRect(startBtnX, startBtnY, 36, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('☰', startBtnX + 11, startBtnY + 22);

      // Taskbar items
      const tasks = ['📁', '🌐', '💻', '📝', '🎵'];
      tasks.forEach((emoji, i) => {
        const tx = 60 + i * 44;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(tx, startBtnY, 36, 32, 6);
        ctx.fill();
        ctx.font = '16px sans-serif';
        ctx.fillText(emoji, tx + 9, startBtnY + 23);
      });

      // System tray
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px monospace';
      const now = new Date();
      ctx.fillText(now.toLocaleTimeString(), w - 80, startBtnY + 20);

      // Desktop icons
      const icons = [
        { emoji: '📁', label: 'Files', x: 30, y: 30 },
        { emoji: '🖥️', label: 'Terminal', x: 30, y: 110 },
        { emoji: '🌐', label: 'Browser', x: 30, y: 190 },
        { emoji: '⚙️', label: 'Settings', x: 30, y: 270 },
        { emoji: '📝', label: 'Notes', x: 120, y: 30 },
        { emoji: '🎨', label: 'GIMP', x: 120, y: 110 },
      ];

      icons.forEach(icon => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(icon.x - 5, icon.y - 5, 75, 70, 8);
        ctx.fill();
        ctx.font = '28px sans-serif';
        ctx.fillText(icon.emoji, icon.x + 15, icon.y + 32);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(icon.label, icon.x + 32, icon.y + 58);
        ctx.textAlign = 'left';
      });

      // Floating window
      const winX = w * 0.35 + Math.sin(time * 0.5) * 5;
      const winY = h * 0.15 + Math.cos(time * 0.3) * 3;
      const winW = w * 0.45;
      const winH = h * 0.55;

      // Window shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.roundRect(winX + 4, winY + 4, winW, winH, 10);
      ctx.fill();

      // Window body
      ctx.fillStyle = 'rgba(30, 30, 50, 0.95)';
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, winH, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Window title bar
      ctx.fillStyle = 'rgba(40, 40, 70, 0.95)';
      ctx.beginPath();
      ctx.roundRect(winX, winY, winW, 36, [10, 10, 0, 0]);
      ctx.fill();

      // Window buttons
      const btnColors = ['#ff5f57', '#ffbd2e', '#28c840'];
      btnColors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(winX + 18 + i * 22, winY + 18, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Window title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText('DeskLink - Terminal', winX + 90, winY + 22);

      // Terminal content
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(winX + 8, winY + 44, winW - 16, winH - 52, 6);
      ctx.fill();

      const termLines = [
        { text: '$ neofetch', color: '#28c840' },
        { text: '        _,met$$$$$gg.', color: '#888' },
        { text: '     ,g$$$$$$$$$$$$$$$P.', color: '#888' },
        { text: "   ,g$$P\"        \"\"\"Y$$.\".", color: '#888' },
        { text: '  ,$$P\'              `$$$.', color: '#888' },
        { text: " '',$$P    DeskLink     ',$$", color: '#888' },
        { text: '   $$P    Linux Host     d$$', color: '#888' },
        { text: '   $$,         ,$$.    ,$$P', color: '#888' },
        { text: "   \"$$         $$P\"   ,$$\"", color: '#888' },
        { text: '', color: '#888' },
        { text: `  OS: Ubuntu 24.04 LTS`, color: '#60a5fa' },
        { text: `  Kernel: 6.8.0-generic`, color: '#60a5fa' },
        { text: `  Resolution: ${config.resolution}`, color: '#60a5fa' },
        { text: `  Display: DeskLink Virtual #2`, color: '#60a5fa' },
        { text: '', color: '#888' },
        { text: '$ desklink-server --status', color: '#28c840' },
        { text: '  ● Server running on port 9090', color: '#28c840' },
        { text: `  ● Connected clients: 1`, color: '#28c840' },
        { text: `  ● Streaming at ${config.fps} FPS`, color: '#28c840' },
        { text: '', color: '#888' },
        { text: '$ █', color: '#fff' },
      ];

      ctx.font = '11px monospace';
      termLines.forEach((line, i) => {
        if (line.text) {
          ctx.fillStyle = line.color;
          ctx.fillText(line.text, winX + 16, winY + 62 + i * 16);
        }
      });

      // Blinking cursor
      if (Math.floor(time * 3) % 2 === 0) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(winX + 24, winY + 62 + (termLines.length - 1) * 16 - 10, 7, 12);
      }

      // Mouse cursor
      if (showCursor) {
        const cx = mousePos.x || w * 0.6 + Math.sin(time) * 50;
        const cy = mousePos.y || h * 0.4 + Math.cos(time * 0.7) * 30;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + 18);
        ctx.lineTo(cx + 5, cy + 14);
        ctx.lineTo(cx + 10, cy + 22);
        ctx.lineTo(cx + 13, cy + 20);
        ctx.lineTo(cx + 8, cy + 12);
        ctx.lineTo(cx + 14, cy + 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [config.resolution, config.fps, mousePos, showCursor]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-xl border border-gray-700 p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Connected to {displayInfo.hostIP}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
            <span><i className="fas fa-tachometer-alt mr-1"></i>{displayInfo.fps} FPS</span>
            <span><i className="fas fa-clock mr-1"></i>{displayInfo.latency}ms</span>
            <span><i className="fas fa-wifi mr-1"></i>{displayInfo.bandwidth} Mbps</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCursor(!showCursor)}
            className={`p-2 rounded-lg transition-all ${showCursor ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
            title="Show cursor"
          >
            <i className="fas fa-mouse-pointer text-sm"></i>
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-all"
            title="Fullscreen"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-sm`}></i>
          </button>
          <button
            onClick={onDisconnect}
            className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all text-sm font-medium"
          >
            <i className="fas fa-times mr-1.5"></i>Disconnect
          </button>
        </div>
      </div>

      {/* Display Area */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border border-gray-700 bg-black cursor-none"
        style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowCursor(true)}
        onMouseLeave={() => setShowCursor(false)}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        
        {/* Overlay info */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-300">
          {displayInfo.resolution} • {config.fps} FPS
        </div>
        
        {/* Touch indicator */}
        {config.touchEnabled && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-green-400">
            <i className="fas fa-hand-pointer mr-1"></i>Touch enabled
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span><i className="fas fa-code mr-1"></i>Codec: H.264</span>
          <span><i className="fas fa-shield-alt mr-1"></i>Encrypted: AES-256</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Move your mouse to control the cursor</span>
        </div>
      </div>
    </div>
  );
}
