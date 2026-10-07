import { useState } from 'react';
import { ConnectionConfig } from '../App';

interface ConnectionPageProps {
  config: ConnectionConfig;
  onConnect: (ip: string, port: number) => void;
  onDemo: () => void;
}

export default function ConnectionPage({ config, onConnect, onDemo }: ConnectionPageProps) {
  const [ip, setIp] = useState(config.hostIP);
  const [port, setPort] = useState(config.port.toString());
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = () => {
    setError('');
    if (!ip.trim()) {
      setError('Please enter a host IP address');
      return;
    }
    if (!port.trim() || isNaN(Number(port))) {
      setError('Please enter a valid port number');
      return;
    }
    setConnecting(true);
    // Simulate connection attempt
    setTimeout(() => {
      setConnecting(false);
      onConnect(ip.trim(), Number(port));
    }, 1500);
  };

  const recentConnections = [
    { ip: '192.168.1.100', port: 9090, label: 'Home Desktop' },
    { ip: '192.168.1.105', port: 9090, label: 'Work Laptop' },
    { ip: '10.0.0.50', port: 9090, label: 'Media Server' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-plug text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect to Host</h2>
        <p className="text-gray-400">Enter the IP address of your Linux machine running the DeskLink server</p>
      </div>

      {/* Connection Form */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <i className="fas fa-server mr-2 text-blue-400"></i>
            Host IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <i className="fas fa-hashtag mr-2 text-purple-400"></i>
            Port
          </label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="9090"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-700/30 rounded-xl p-3">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {connecting ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                Connecting...
              </>
            ) : (
              <>
                <i className="fas fa-plug"></i>
                Connect
              </>
            )}
          </button>
          <button
            onClick={onDemo}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all border border-gray-600"
          >
            <i className="fas fa-play mr-2"></i>Demo
          </button>
        </div>
      </div>

      {/* Recent Connections */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-history text-gray-400"></i>
          Recent Connections
        </h3>
        <div className="space-y-2">
          {recentConnections.map((conn, i) => (
            <button
              key={i}
              onClick={() => { setIp(conn.ip); setPort(conn.port.toString()); }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                  <i className="fas fa-desktop text-gray-400 text-sm"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-200">{conn.label}</p>
                  <p className="text-xs text-gray-500">{conn.ip}:{conn.port}</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-600 group-hover:text-gray-400 transition-colors"></i>
            </button>
          ))}
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-blue-400"></i>
          How to Find Your Host IP
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <p>On your Linux host machine, run one of these commands:</p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs">
            <p className="text-green-400"># Using ip command</p>
            <p className="text-gray-300">ip addr show | grep "inet "</p>
            <p className="text-green-400 mt-2"># Using hostname</p>
            <p className="text-gray-300">hostname -I</p>
            <p className="text-green-400 mt-2"># Using ifconfig</p>
            <p className="text-gray-300">ifconfig | grep "inet "</p>
          </div>
          <p className="text-gray-400">Look for the IP address on your local network (usually starts with 192.168.x.x or 10.x.x.x)</p>
        </div>
      </div>
    </div>
  );
}
