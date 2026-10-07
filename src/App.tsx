import { useState, useEffect } from 'react';
import ConnectionPage from './components/ConnectionPage';
import DisplayViewer from './components/DisplayViewer';
import Dashboard from './components/Dashboard';
import ServerSetup from './components/ServerSetup';
import Settings from './components/Settings';

export type AppView = 'dashboard' | 'connect' | 'viewer' | 'setup' | 'settings';

export interface ConnectionConfig {
  hostIP: string;
  port: number;
  resolution: string;
  quality: string;
  fps: number;
  touchEnabled: boolean;
  autoReconnect: boolean;
}

export interface DisplayInfo {
  connected: boolean;
  hostIP: string;
  resolution: string;
  fps: number;
  latency: number;
  bandwidth: number;
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [config, setConfig] = useState<ConnectionConfig>({
    hostIP: '192.168.1.100',
    port: 9090,
    resolution: '1920x1080',
    quality: 'high',
    fps: 30,
    touchEnabled: true,
    autoReconnect: true,
  });
  const [displayInfo, setDisplayInfo] = useState<DisplayInfo>({
    connected: false,
    hostIP: '',
    resolution: '',
    fps: 0,
    latency: 0,
    bandwidth: 0,
  });

  const handleConnect = (ip: string, port: number) => {
    setConfig(prev => ({ ...prev, hostIP: ip, port }));
    setDisplayInfo({
      connected: true,
      hostIP: ip,
      resolution: config.resolution,
      fps: config.fps,
      latency: Math.floor(Math.random() * 20) + 5,
      bandwidth: Math.floor(Math.random() * 50) + 30,
    });
    setCurrentView('viewer');
  };

  const handleDisconnect = () => {
    setDisplayInfo(prev => ({ ...prev, connected: false }));
    setCurrentView('dashboard');
  };

  const handleStartDemo = () => {
    setDisplayInfo({
      connected: true,
      hostIP: '127.0.0.1 (Demo)',
      resolution: config.resolution,
      fps: config.fps,
      latency: Math.floor(Math.random() * 10) + 2,
      bandwidth: Math.floor(Math.random() * 30) + 60,
    });
    setCurrentView('viewer');
  };

  // Simulate live stats updates
  useEffect(() => {
    if (!displayInfo.connected) return;
    const interval = setInterval(() => {
      setDisplayInfo(prev => ({
        ...prev,
        latency: Math.max(1, prev.latency + Math.floor(Math.random() * 6) - 3),
        bandwidth: Math.max(10, prev.bandwidth + Math.floor(Math.random() * 10) - 5),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [displayInfo.connected]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-desktop text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DeskLink
              </span>
              <span className="text-xs text-gray-400 ml-1 hidden sm:inline">for Linux</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className="fas fa-home mr-1.5"></i>Dashboard
              </button>
              <button
                onClick={() => setCurrentView('connect')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'connect'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className="fas fa-plug mr-1.5"></i>Connect
              </button>
              <button
                onClick={() => setCurrentView('setup')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'setup'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className="fas fa-server mr-1.5"></i>Server
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className="fas fa-cog mr-1.5"></i>Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            displayInfo={displayInfo}
            onConnect={() => setCurrentView('connect')}
            onViewDisplay={() => setCurrentView('viewer')}
            onDemo={handleStartDemo}
          />
        )}
        {currentView === 'connect' && (
          <ConnectionPage
            config={config}
            onConnect={handleConnect}
            onDemo={handleStartDemo}
          />
        )}
        {currentView === 'viewer' && (
          <DisplayViewer
            displayInfo={displayInfo}
            config={config}
            onDisconnect={handleDisconnect}
          />
        )}
        {currentView === 'setup' && <ServerSetup />}
        {currentView === 'settings' && (
          <Settings config={config} setConfig={setConfig} />
        )}
      </main>
    </div>
  );
}

export default App;
