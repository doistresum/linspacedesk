import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TabletViewerProps {
  onConnectFromTablet: (ip: string, port: number) => void;
}

export default function TabletViewer({ onConnectFromTablet }: TabletViewerProps) {
  const [activeTab, setActiveTab] = useState<'connect' | 'viewer' | 'apk' | 'pwa'>('connect');
  const [serverIP, setServerIP] = useState('');
  const [serverPort, setServerPort] = useState('9090');
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [detectedServers, setDetectedServers] = useState<Array<{ip: string; port: number; hostname: string}>>([]);
  const [scanning, setScanning] = useState(false);

  // Get current host IP for QR code
  const currentHost = window.location.hostname || 'localhost';
  const viewerURL = `http://${currentHost}:${window.location.port || '5173'}/#/tablet-viewer`;

  // Simulate network scanning for servers
  const startScan = () => {
    setScanning(true);
    setDetectedServers([]);
    setTimeout(() => {
      setDetectedServers([
        { ip: '192.168.1.100', port: 9090, hostname: 'debian-pc' },
        { ip: '192.168.1.105', port: 9090, hostname: 'work-laptop' },
      ]);
      setScanning(false);
    }, 2500);
  };

  const handleConnect = () => {
    if (!serverIP.trim()) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setIsConnected(true);
      onConnectFromTablet(serverIP, Number(serverPort));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-tablet-alt text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Tablet / Mobile Viewer</h2>
        <p className="text-gray-400">Connect your Android tablet or phone as a secondary display</p>
        <p className="text-xs text-gray-500 mt-1">Compatible with Android 4.2+ (Jelly Bean API 17+)</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800/50 rounded-xl p-2 border border-gray-700">
        {[
          { id: 'connect', label: 'Connect', icon: 'fas fa-wifi' },
          { id: 'viewer', label: 'Mobile Viewer', icon: 'fas fa-tablet' },
          { id: 'apk', label: 'Build APK', icon: 'fab fa-android' },
          { id: 'pwa', label: 'PWA Install', icon: 'fas fa-download' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <i className={tab.icon}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'connect' && (
        <ConnectTab
          serverIP={serverIP}
          setServerIP={setServerIP}
          serverPort={serverPort}
          setServerPort={setServerPort}
          isConnected={isConnected}
          connecting={connecting}
          detectedServers={detectedServers}
          scanning={scanning}
          onStartScan={startScan}
          onConnect={handleConnect}
          viewerURL={viewerURL}
        />
      )}
      {activeTab === 'viewer' && <MobileViewerTab isConnected={isConnected} serverIP={serverIP} />}
      {activeTab === 'apk' && <APKBuildTab />}
      {activeTab === 'pwa' && <PWATab viewerURL={viewerURL} />}
    </div>
  );
}

function ConnectTab({ serverIP, setServerIP, serverPort, setServerPort, isConnected, connecting, detectedServers, scanning, onStartScan, onConnect, viewerURL }: any) {
  return (
    <div className="space-y-6">
      {/* QR Code Section */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-qrcode text-teal-400"></i>
          Scan to Open on Tablet
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white p-4 rounded-2xl">
            <QRCodeSVG
              value={viewerURL}
              size={180}
              level="M"
              includeMargin={true}
            />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-gray-300 text-sm">
              Scan this QR code with your Android tablet's camera or QR scanner to open the DeskLink viewer directly in the browser.
            </p>
            <div className="bg-gray-900 rounded-xl p-3 font-mono text-xs text-teal-300 break-all">
              {viewerURL}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="bg-gray-800 px-2 py-1 rounded">📱 Android 4.2+</span>
              <span className="bg-gray-800 px-2 py-1 rounded">📱 iOS 9+</span>
              <span className="bg-gray-800 px-2 py-1 rounded">🖥️ Any browser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Connection */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-keyboard text-blue-400"></i>
          Manual Connection
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Server IP Address (Debian 13 Host)
            </label>
            <input
              type="text"
              value={serverIP}
              onChange={(e) => setServerIP(e.target.value)}
              placeholder="192.168.1.100"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
            <input
              type="text"
              value={serverPort}
              onChange={(e) => setServerPort(e.target.value)}
              placeholder="9090"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={onConnect}
            disabled={connecting || !serverIP.trim()}
            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:opacity-50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {connecting ? (
              <><i className="fas fa-spinner animate-spin"></i>Connecting...</>
            ) : isConnected ? (
              <><i className="fas fa-check-circle"></i>Connected! Tap to View</>
            ) : (
              <><i className="fas fa-plug"></i>Connect to Server</>
            )}
          </button>
        </div>
      </div>

      {/* Auto-discovery */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-search text-purple-400"></i>
          Auto-Discover Servers
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Automatically find DeskLink servers on your local network using mDNS/Bonjour or UDP broadcast.
        </p>
        <button
          onClick={onStartScan}
          disabled={scanning}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"
        >
          {scanning ? (
            <><i className="fas fa-spinner animate-spin"></i>Scanning network...</>
          ) : (
            <><i className="fas fa-radar"></i><i className="fas fa-search"></i>Scan for Servers</>
          )}
        </button>

        {detectedServers.length > 0 && (
          <div className="mt-4 space-y-2">
            {detectedServers.map((server: any, i: number) => (
              <button
                key={i}
                onClick={() => { setServerIP(server.ip); setServerPort(server.port.toString()); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-teal-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 flex items-center justify-center">
                    <i className="fas fa-server text-teal-400 text-sm"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-200">{server.hostname}</p>
                    <p className="text-xs text-gray-500">{server.ip}:{server.port}</p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-600"></i>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileViewerTab({ isConnected, serverIP }: { isConnected: boolean; serverIP: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchPoints, setTouchPoints] = useState<Array<{x: number; y: number; id: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animFrame: number;

    const animate = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      // Desktop background
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Simulated app windows
      // Window 1 - File Manager
      const w1x = w * 0.05, w1y = h * 0.08, w1w = w * 0.42, w1h = h * 0.45;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.beginPath(); ctx.roundRect(w1x, w1y, w1w, w1h, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'; ctx.stroke();
      // Title bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath(); ctx.roundRect(w1x, w1y, w1w, 28, [8, 8, 0, 0]); ctx.fill();
      ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
      ctx.fillText('📁 Files - Home', w1x + 8, w1y + 18);
      // File items
      const files = ['Documents', 'Downloads', 'Pictures', 'Videos', 'Music'];
      files.forEach((f, i) => {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.05)' : 'transparent';
        ctx.fillRect(w1x + 4, w1y + 32 + i * 24, w1w - 8, 22);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '11px sans-serif';
        ctx.fillText(`📄 ${f}`, w1x + 12, w1y + 48 + i * 24);
      });

      // Window 2 - Terminal
      const w2x = w * 0.52, w2y = h * 0.12, w2w = w * 0.44, w2h = h * 0.5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath(); ctx.roundRect(w2x, w2y, w2w, w2h, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.2)'; ctx.stroke();
      ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
      ctx.beginPath(); ctx.roundRect(w2x, w2y, w2w, 24, [8, 8, 0, 0]); ctx.fill();
      ctx.fillStyle = '#4ade80'; ctx.font = '9px monospace';
      ctx.fillText('Terminal — bash', w2x + 8, w2y + 16);
      
      const lines = [
        { t: '$ desklink-server --status', c: '#4ade80' },
        { t: '● Server: Running', c: '#4ade80' },
        { t: '● Port: 9090', c: '#4ade80' },
        { t: '● Clients: 1 (tablet-viewer)', c: '#4ade80' },
        { t: '● Uptime: 2h 34m', c: '#4ade80' },
        { t: '', c: '#888' },
        { t: '$ xrandr --listmonitors', c: '#4ade80' },
        { t: 'Monitor 1: HDMI-1 1920x1080', c: '#60a5fa' },
        { t: 'Monitor 2: DeskLink-Virtual', c: '#60a5fa' },
        { t: '             1920x1080 +1920+0', c: '#60a5fa' },
        { t: '', c: '#888' },
        { t: '$ █', c: '#fff' },
      ];
      lines.forEach((l, i) => {
        if (l.t) {
          ctx.fillStyle = l.c;
          ctx.font = '9px monospace';
          ctx.fillText(l.t, w2x + 8, w2y + 40 + i * 14);
        }
      });

      // Taskbar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, h - 36, w, 36);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(0, h - 36, w, 1);
      
      // Start button
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.beginPath(); ctx.roundRect(8, h - 30, 28, 24, 4); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '12px sans-serif';
      ctx.fillText('☰', 15, h - 13);

      // Clock
      ctx.fillStyle = '#e2e8f0'; ctx.font = '10px monospace';
      const now = new Date();
      ctx.fillText(now.toLocaleTimeString(), w - 70, h - 14);

      // Touch points visualization
      touchPoints.forEach(tp => {
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.fill();
      });

      animFrame = requestAnimationFrame(animate);
    };

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, [touchPoints]);

  const handleTouch = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const points = Array.from(e.touches).map(t => ({
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
      id: t.identifier,
    }));
    setTouchPoints(points);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-sm text-gray-300">
              {isConnected ? `Connected to ${serverIP}` : 'Not connected - use Connect tab first'}
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Touch to interact</span>
        </div>
      </div>

      {/* Mobile Display Preview */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border-4 border-gray-700 bg-black"
        style={{ height: '500px', maxWidth: '800px', margin: '0 auto' }}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={() => setTouchPoints([])}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Overlay indicators */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-teal-400">
          <i className="fas fa-tablet-alt mr-1"></i>Tablet Mode
        </div>
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-300">
          1920×1080 • 30fps
        </div>
        {touchPoints.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-blue-400">
            <i className="fas fa-hand-pointer mr-1"></i>{touchPoints.length} touch point{touchPoints.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-800px mx-auto">
        <TouchButton icon="fas fa-arrow-left" label="Back" />
        <TouchButton icon="fas fa-home" label="Home" />
        <TouchButton icon="fas fa-expand" label="Fullscreen" />
        <TouchButton icon="fas fa-keyboard" label="Keyboard" />
      </div>
    </div>
  );
}

function TouchButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-800 border border-gray-700 hover:border-teal-500 transition-all">
      <i className={`${icon} text-teal-400`}></i>
      <span className="text-xs text-gray-400">{label}</span>
    </button>
  );
}

function APKBuildTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fab fa-android text-green-400"></i>
          Build Native APK for Android 4.2+
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Wrap the DeskLink web viewer into a native Android APK using a WebView wrapper. 
          This ensures compatibility with Android 4.2 (API 17) and provides a native app experience.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-xs">1</span>
              Project Setup (Android Studio)
            </h4>
            <CodeBlock language="bash" code={`# Create new Android project with minimum SDK 17
# File > New Project > Empty Activity
# Minimum SDK: API 17 (Android 4.2 Jelly Bean)
# Package: com.desklink.viewer

# Or use command line:
mkdir desklink-viewer && cd desklink-viewer
# Open Android Studio > Import Project`} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-xs">2</span>
              AndroidManifest.xml
            </h4>
            <CodeBlock language="xml" code={`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.desklink.viewer">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="DeskLink Viewer"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="landscape"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-xs">3</span>
              MainActivity.java (Android 4.2 Compatible)
            </h4>
            <CodeBlock language="java" code={`package com.desklink.viewer;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.widget.EditText;
import android.widget.Button;
import android.widget.LinearLayout;
import android.view.Gravity;
import android.graphics.Color;
import android.net.NetworkInfo;
import android.net.ConnectivityManager;
import android.content.Context;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private EditText ipInput;
    private Button connectBtn;
    private LinearLayout connectLayout;
    private String serverUrl = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Fullscreen immersive mode
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Build UI programmatically (no XML layout needed)
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.parseColor("#0f172a"));
        root.setGravity(Gravity.CENTER);
        root.setPadding(40, 40, 40, 40);

        // Connection form
        connectLayout = new LinearLayout(this);
        connectLayout.setOrientation(LinearLayout.VERTICAL);
        connectLayout.setGravity(Gravity.CENTER);
        connectLayout.setPadding(30, 30, 30, 30);

        // Title
        android.widget.TextView title = new android.widget.TextView(this);
        title.setText("DeskLink Viewer");
        title.setTextSize(24);
        title.setTextColor(Color.parseColor("#38bdf8"));
        title.setGravity(Gravity.CENTER);
        connectLayout.addView(title);

        // Subtitle
        android.widget.TextView subtitle = new android.widget.TextView(this);
        subtitle.setText("Enter your Debian PC's IP address");
        subtitle.setTextSize(14);
        subtitle.setTextColor(Color.GRAY);
        subtitle.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        subParams.setMargins(0, 8, 0, 24);
        connectLayout.addView(subtitle, subParams);

        // IP Input
        ipInput = new EditText(this);
        ipInput.setHint("192.168.1.100");
        ipInput.setTextColor(Color.WHITE);
        ipInput.setHintTextColor(Color.DKGRAY);
        ipInput.setBackgroundColor(Color.parseColor("#1e293b"));
        ipInput.setPadding(20, 15, 20, 15);
        connectLayout.addView(ipInput);

        // Connect Button
        connectBtn = new Button(this);
        connectBtn.setText("Connect");
        connectBtn.setTextColor(Color.WHITE);
        connectBtn.setBackgroundColor(Color.parseColor("#0d9488"));
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.setMargins(0, 16, 0, 0);
        connectLayout.addView(connectBtn, btnParams);

        connectBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String ip = ipInput.getText().toString().trim();
                if (ip.isEmpty()) {
                    Toast.makeText(MainActivity.this, 
                        "Please enter server IP", Toast.LENGTH_SHORT).show();
                    return;
                }
                serverUrl = "http://" + ip + ":9090/viewer";
                connectLayout.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                webView.loadUrl(serverUrl);
            }
        });

        // WebView
        webView = new WebView(this);
        webView.setVisibility(View.GONE);
        webView.setBackgroundColor(Color.BLACK);
        
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // Enable touch events
        webView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, android.view.MotionEvent event) {
                // Touch events are forwarded to WebView/JavaScript
                return false;
            }
        });

        root.addView(connectLayout);
        root.addView(webView, new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ));

        setContentView(root);
    }

    @Override
    public void onBackPressed() {
        if (webView.getVisibility() == View.VISIBLE && webView.canGoBack()) {
            webView.goBack();
        } else if (webView.getVisibility() == View.VISIBLE) {
            webView.setVisibility(View.GONE);
            connectLayout.setVisibility(View.VISIBLE);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }
}`} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-xs">4</span>
              Build the APK
            </h4>
            <CodeBlock language="bash" code={`# Using Android Studio:
# Build > Build Bundle(s) / APK(s) > Build APK(s)

# Or using Gradle command line:
./gradlew assembleDebug

# APK output location:
# app/build/outputs/apk/debug/app-debug.apk

# For release build:
./gradlew assembleRelease

# Install on device via ADB:
adb install app/build/outputs/apk/debug/app-debug.apk`} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-xs">5</span>
              Alternative: Use Cordova/PhoneGap
            </h4>
            <CodeBlock language="bash" code={`# Install Cordova CLI
npm install -g cordova

# Create project
cordova create desklink-viewer com.desklink.viewer "DeskLink Viewer"
cd desklink-viewer

# Add Android platform (supports API 17+)
cordova platform add android@9

# Replace www/index.html with the DeskLink viewer
cp -r /path/to/desklink-web/dist/* www/

# Build APK
cordova build android

# Output: platforms/android/app/build/outputs/apk/debug/app-debug.apk`} />
          </div>
        </div>
      </div>

      {/* Compatibility Notes */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-check-circle text-green-400"></i>
          Android 4.2+ Compatibility Notes
        </h3>
        <div className="space-y-3">
          <CompatItem text="Uses Activity (not AppCompatActivity) for max compatibility" />
          <CompatItem text="No Material Design dependencies - pure Android SDK" />
          <CompatItem text="WebView with JavaScript enabled for the web viewer" />
          <CompatItem text="Programmatic UI layout (no XML resource dependencies)" />
          <CompatItem text="Keep screen on during display streaming" />
          <CompatItem text="Handles back button navigation properly" />
          <CompatItem text="Touch events forwarded to WebView for interaction" />
          <CompatItem text="minSdkVersion 17 (Android 4.2 Jelly Bean)" />
        </div>
      </div>

      {/* Debian Server Requirements */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fab fa-linux text-yellow-400"></i>
          Debian 13 Server Requirements
        </h3>
        <div className="space-y-3">
          <CompatItem text="desklink-server running on port 9090" />
          <CompatItem text="Firewall allows incoming TCP 9090" />
          <CompatItem text="Both devices on same WiFi/LAN network" />
          <CompatItem text="Server binds to 0.0.0.0 (not just localhost)" />
          <CompatItem text="Virtual display configured via X11/Wayland" />
          <CompatItem text="H.264 encoding for best Android WebView compatibility" />
        </div>
      </div>
    </div>
  );
}

function PWATab({ viewerURL }: { viewerURL: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-download text-blue-400"></i>
          Install as PWA (No APK Needed)
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          The DeskLink viewer can be installed directly as a Progressive Web App on your Android device. 
          This gives you a full-screen app experience without needing to build an APK.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">Installation Steps:</h4>
            <div className="space-y-3">
              <StepItem number={1} text="Open Chrome/Firefox on your Android tablet" />
              <StepItem number={2} text={`Navigate to: ${viewerURL}`} />
              <StepItem number={3} text="Tap the ⋮ menu (or ≡ in Firefox)" />
              <StepItem number={4} text='Select "Add to Home screen" or "Install app"' />
              <StepItem number={5} text="The DeskLink icon appears on your home screen" />
              <StepItem number={6} text="Tap it to launch in full-screen mode!" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-code text-purple-400"></i>
          PWA Manifest & Service Worker
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          The PWA manifest and service worker are already included in the DeskLink web app. 
          Here's what they contain:
        </p>
        <CodeBlock language="json" code={`// manifest.json
{
  "name": "DeskLink Viewer",
  "short_name": "DeskLink",
  "description": "Use your tablet as a secondary display",
  "start_url": "/tablet-viewer",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#0f172a",
  "theme_color": "#0d9488",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`} />
      </div>

      <div className="bg-teal-900/20 border border-teal-700/30 rounded-xl p-4">
        <p className="text-sm text-teal-300 flex items-start gap-2">
          <i className="fas fa-lightbulb mt-0.5"></i>
          <span>
            <strong>Tip:</strong> PWA installation works on Android 4.4+ with Chrome. For Android 4.2-4.3, 
            use the APK method instead (see "Build APK" tab).
          </span>
        </p>
      </div>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <i className={`fas ${copied ? 'fa-check text-green-400' : 'fa-copy'} text-xs`}></i>
        </button>
      </div>
      <pre className="bg-gray-900 rounded-xl p-4 pt-10 overflow-x-auto text-xs font-mono text-gray-300 border border-gray-700 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">
        {number}
      </div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}

function CompatItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <i className="fas fa-check text-green-400 text-xs"></i>
      {text}
    </div>
  );
}
