import { ConnectionConfig } from '../App';

interface SettingsProps {
  config: ConnectionConfig;
  setConfig: (config: ConnectionConfig) => void;
}

export default function Settings({ config, setConfig }: SettingsProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-cog text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-400">Configure your DeskLink viewer preferences</p>
      </div>

      {/* Display Settings */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-desktop text-blue-400"></i>
          Display Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
            <select
              value={config.resolution}
              onChange={(e) => setConfig({ ...config, resolution: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="3840x2160">3840 × 2160 (4K UHD)</option>
              <option value="2560x1440">2560 × 1440 (QHD)</option>
              <option value="1920x1080">1920 × 1080 (Full HD)</option>
              <option value="1600x900">1600 × 900 (HD+)</option>
              <option value="1280x720">1280 × 720 (HD)</option>
              <option value="1024x768">1024 × 768 (XGA)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frame Rate: <span className="text-blue-400">{config.fps} FPS</span>
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={config.fps}
              onChange={(e) => setConfig({ ...config, fps: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>15 FPS</span>
              <span>30 FPS</span>
              <span>60 FPS</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Stream Quality</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Low', desc: 'Best for slow networks', icon: 'fas fa-battery-quarter' },
                { value: 'medium', label: 'Medium', desc: 'Balanced quality', icon: 'fas fa-battery-half' },
                { value: 'high', label: 'High', desc: 'Best quality', icon: 'fas fa-battery-full' },
              ].map(q => (
                <button
                  key={q.value}
                  onClick={() => setConfig({ ...config, quality: q.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    config.quality === q.value
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <i className={`${q.icon} text-lg mb-1 block`}></i>
                  <p className="text-sm font-medium">{q.label}</p>
                  <p className="text-xs opacity-70">{q.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Settings */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-hand-pointer text-purple-400"></i>
          Input Settings
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Touch Input"
            description="Forward touch events to the host machine"
            icon="fas fa-hand-pointer"
            enabled={config.touchEnabled}
            onChange={(v) => setConfig({ ...config, touchEnabled: v })}
          />
          <ToggleSetting
            label="Auto Reconnect"
            description="Automatically reconnect if connection is lost"
            icon="fas fa-redo"
            enabled={config.autoReconnect}
            onChange={(v) => setConfig({ ...config, autoReconnect: v })}
          />
        </div>
      </div>

      {/* Network Settings */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-network-wired text-green-400"></i>
          Connection Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Default Port</label>
            <input
              type="number"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">Port used to connect to the DeskLink server (default: 9090)</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-gray-400"></i>
          About
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Version" value="1.2.0" />
          <InfoItem label="Protocol" value="WebSocket + WebRTC" />
          <InfoItem label="Codec" value="H.264 / VP9" />
          <InfoItem label="Encryption" value="TLS 1.3 + AES-256" />
          <InfoItem label="Platform" value="Linux (x86_64, ARM64)" />
          <InfoItem label="License" value="MIT Open Source" />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <i className="fab fa-github"></i>
            <span>github.com/desklink/server</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <i className="fas fa-book"></i>
            <span>Documentation</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, icon, enabled, onChange }: {
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
          <i className={icon}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all ${
          enabled ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          enabled ? 'left-6.5 translate-x-0' : 'left-0.5'
        }`}
          style={{ left: enabled ? '26px' : '2px' }}
        ></div>
      </button>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-200 font-medium">{value}</p>
    </div>
  );
}
