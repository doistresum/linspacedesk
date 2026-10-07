import { DisplayInfo } from '../App';

interface DashboardProps {
  displayInfo: DisplayInfo;
  onConnect: () => void;
  onViewDisplay: () => void;
  onDemo: () => void;
  onTablet?: () => void;
}

export default function Dashboard({ displayInfo, onConnect, onViewDisplay, onDemo, onTablet }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-gray-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">DeskLink</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-6">
            Turn any device with a web browser into a secondary display for your Linux machine.
            Stream your desktop over the local network with low latency and full touch support.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onConnect}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              <i className="fas fa-plug mr-2"></i>Connect to Host
            </button>
            <button
              onClick={onDemo}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all border border-gray-600"
            >
              <i className="fas fa-play mr-2"></i>Start Demo
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          icon="fas fa-wifi"
          iconColor="text-green-400"
          title="Connection"
          value={displayInfo.connected ? 'Connected' : 'Disconnected'}
          subtitle={displayInfo.connected ? displayInfo.hostIP : 'Not connected to any host'}
          status={displayInfo.connected ? 'active' : 'inactive'}
        />
        <StatusCard
          icon="fas fa-tachometer-alt"
          iconColor="text-blue-400"
          title="Performance"
          value={displayInfo.connected ? `${displayInfo.fps} FPS` : '-- FPS'}
          subtitle={displayInfo.connected ? `${displayInfo.latency}ms latency` : 'No active stream'}
          status={displayInfo.connected ? 'active' : 'inactive'}
        />
        <StatusCard
          icon="fas fa-expand-arrows-alt"
          iconColor="text-purple-400"
          title="Display"
          value={displayInfo.connected ? displayInfo.resolution : '--'}
          subtitle={displayInfo.connected ? `${displayInfo.bandwidth} Mbps` : 'No resolution set'}
          status={displayInfo.connected ? 'active' : 'inactive'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-rocket text-yellow-400"></i>
            Quick Start
          </h3>
          <div className="space-y-3">
            <QuickStep number={1} text="Install the DeskLink server on your Linux host" />
            <QuickStep number={2} text="Start the server with desklink-server --start" />
            <QuickStep number={3} text="Enter the host IP address in the Connect page" />
            <QuickStep number={4} text="Your device becomes a secondary display!" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-tablet-alt text-teal-400"></i>
            Android Tablet
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-300">
              Use your Android tablet (4.2+) as a wireless secondary display.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-700/30">
                <i className="fab fa-android mr-1"></i>Android 4.2+
              </span>
              <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-700/30">
                <i className="fas fa-qrcode mr-1"></i>QR Connect
              </span>
              <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-700/30">
                <i className="fas fa-mobile-alt mr-1"></i>PWA/APK
              </span>
            </div>
            {onTablet && (
              <button
                onClick={onTablet}
                className="w-full mt-2 px-4 py-2.5 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-xl text-sm font-medium text-teal-300 transition-all"
              >
                <i className="fas fa-tablet-alt mr-2"></i>Open Tablet Viewer
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-star text-yellow-400"></i>
            Features
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <Feature icon="fas fa-desktop" text="Multi-display" />
            <Feature icon="fas fa-hand-pointer" text="Touch input" />
            <Feature icon="fas fa-bolt" text="Low latency" />
            <Feature icon="fas fa-lock" text="Encrypted" />
            <Feature icon="fas fa-sliders-h" text="Adjustable quality" />
            <Feature icon="fas fa-network-wired" text="LAN & WAN" />
          </div>
        </div>
      </div>

      {/* Active Display Button */}
      {displayInfo.connected && (
        <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold text-green-300">Display Active</p>
              <p className="text-sm text-gray-400">
                Streaming from {displayInfo.hostIP} at {displayInfo.resolution}
              </p>
            </div>
          </div>
          <button
            onClick={onViewDisplay}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all"
          >
            <i className="fas fa-external-link-alt mr-2"></i>View Display
          </button>
        </div>
      )}
    </div>
  );
}

function StatusCard({ icon, iconColor, title, value, subtitle, status }: {
  icon: string;
  iconColor: string;
  title: string;
  value: string;
  subtitle: string;
  status: 'active' | 'inactive';
}) {
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center ${iconColor}`}>
          <i className={icon}></i>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function QuickStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
        {number}
      </div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <i className={`${icon} text-blue-400 text-xs`}></i>
      {text}
    </div>
  );
}
