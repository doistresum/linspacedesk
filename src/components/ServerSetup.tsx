import { useState } from 'react';

export default function ServerSetup() {
  const [activeTab, setActiveTab] = useState<'install' | 'configure' | 'run' | 'advanced'>('install');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-server text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Server Setup Guide</h2>
        <p className="text-gray-400">Install and configure the DeskLink server on your Linux machine</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-800/50 rounded-xl p-2 border border-gray-700">
        {[
          { id: 'install', label: 'Install', icon: 'fas fa-download' },
          { id: 'configure', label: 'Configure', icon: 'fas fa-sliders-h' },
          { id: 'run', label: 'Run', icon: 'fas fa-play' },
          { id: 'advanced', label: 'Advanced', icon: 'fas fa-cogs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <i className={tab.icon}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
        {activeTab === 'install' && <InstallTab />}
        {activeTab === 'configure' && <ConfigureTab />}
        {activeTab === 'run' && <RunTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
      </div>
    </div>
  );
}

function InstallTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">1</span>
          System Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RequirementItem title="OS" value="Ubuntu 20.04+, Fedora 36+, Arch Linux" />
          <RequirementItem title="Display Server" value="X11 or Wayland" />
          <RequirementItem title="Network" value="Same LAN or accessible IP" />
          <RequirementItem title="GPU" value="Any (software encoding fallback)" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">2</span>
          Installation Methods
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Option A: Using apt (Ubuntu/Debian)</p>
            <CodeBlock language="bash" code={`# Add the DeskLink repository
sudo apt-add-repository ppa:desklink/stable
sudo apt update

# Install the server package
sudo apt install desklink-server

# Install optional hardware encoding support
sudo apt install desklink-server-hwaccel`} />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Option B: Using Flatpak</p>
            <CodeBlock language="bash" code={`# Install via Flatpak
flatpak install flathub com.desklink.Server

# Run
flatpak run com.desklink.Server`} />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2 font-medium">Option C: Build from source</p>
            <CodeBlock language="bash" code={`# Clone the repository
git clone https://github.com/desklink/server.git
cd server

# Install dependencies
sudo apt install cmake libx11-dev libxrandr-dev \\
  libpulse-dev libavcodec-dev libavformat-dev \\
  libswscale-dev libssl-dev

# Build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)

# Install
sudo make install`} />
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-sm text-blue-300 flex items-start gap-2">
          <i className="fas fa-info-circle mt-0.5"></i>
          <span>After installation, the server binary will be available at <code className="bg-gray-800 px-1.5 py-0.5 rounded text-blue-200">/usr/bin/desklink-server</code></span>
        </p>
      </div>
    </div>
  );
}

function ConfigureTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">1</span>
          Configuration File
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          The server reads configuration from <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-200">~/.config/desklink/config.json</code>
        </p>
        <CodeBlock language="json" code={`{
  "server": {
    "port": 9090,
    "bind_address": "0.0.0.0",
    "max_clients": 5,
    "password": null,
    "ssl_enabled": true,
    "ssl_cert": "/etc/desklink/cert.pem",
    "ssl_key": "/etc/desklink/key.pem"
  },
  "display": {
    "virtual_display": "auto",
    "resolution": "1920x1080",
    "refresh_rate": 60,
    "color_depth": 24
  },
  "encoding": {
    "codec": "h264",
    "quality": "high",
    "bitrate": 8000,
    "keyframe_interval": 2,
    "hardware_accel": true,
    "encoder_preset": "fast"
  },
  "input": {
    "mouse_enabled": true,
    "touch_enabled": true,
    "keyboard_enabled": true,
    "pen_enabled": true
  },
  "audio": {
    "enabled": true,
    "device": "default",
    "sample_rate": 48000
  }
}`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">2</span>
          Quick Configuration
        </h3>
        <CodeBlock language="bash" code={`# Generate default config
desklink-server --init-config

# Set a password for connections
desklink-server --set-password "your-secure-password"

# Enable SSL/TLS
desklink-server --enable-ssl --generate-cert

# Configure display resolution
desklink-server --set-resolution 1920x1080`} />
      </div>
    </div>
  );
}

function RunTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">1</span>
          Start the Server
        </h3>
        <CodeBlock language="bash" code={`# Start with default settings
desklink-server --start

# Start with specific options
desklink-server --start --port 9090 --resolution 1920x1080

# Start in background
desklink-server --start --daemon

# Start with verbose logging
desklink-server --start --verbose`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">2</span>
          Systemd Service (Auto-start)
        </h3>
        <CodeBlock language="bash" code={`# Install the systemd service
sudo desklink-server --install-service

# Enable on boot
sudo systemctl enable desklink-server

# Start the service
sudo systemctl start desklink-server

# Check status
sudo systemctl status desklink-server

# View logs
journalctl -u desklink-server -f`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">3</span>
          Verify It's Running
        </h3>
        <CodeBlock language="bash" code={`# Check if server is listening
ss -tlnp | grep 9090

# Test connection
curl http://localhost:9090/api/status

# Expected output:
# {"status":"running","version":"1.2.0","clients":0,"display":"Virtual-2"}`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">4</span>
          Firewall Configuration
        </h3>
        <CodeBlock language="bash" code={`# UFW (Ubuntu)
sudo ufw allow 9090/tcp

# firewalld (Fedora)
sudo firewall-cmd --permanent --add-port=9090/tcp
sudo firewall-cmd --reload

# iptables
sudo iptables -A INPUT -p tcp --dport 9090 -j ACCEPT`} />
      </div>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-microchip text-purple-400"></i>
          Hardware Acceleration
        </h3>
        <CodeBlock language="bash" code={`# Check available encoders
desklink-server --list-encoders

# Use NVIDIA NVENC
desklink-server --start --encoder nvenc

# Use Intel QSV
desklink-server --start --encoder qsv

# Use AMD AMF/VCE
desklink-server --start --encoder amf

# Use VAAPI (open source)
desklink-server --start --encoder vaapi`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-network-wired text-blue-400"></i>
          Network Optimization
        </h3>
        <CodeBlock language="bash" code={`# Reduce latency (may increase bandwidth)
desklink-server --start --latency-mode ultra

# Optimize for slow connections
desklink-server --start --quality low --fps 15

# Enable bandwidth limiting
desklink-server --start --max-bandwidth 5000

# Use UDP for lower latency (experimental)
desklink-server --start --protocol udp`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-desktop text-green-400"></i>
          Multi-Monitor Setup
        </h3>
        <CodeBlock language="bash" code={`# List available displays
desklink-server --list-displays

# Create virtual display for each client
desklink-server --start --virtual-displays 3

# Assign specific resolution per display
desklink-server --start \\
  --display-1 1920x1080 \\
  --display-2 2560x1440 \\
  --display-3 1920x1080`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <i className="fas fa-key text-yellow-400"></i>
          Security
        </h3>
        <CodeBlock language="bash" code={`# Generate strong SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem \\
  -out cert.pem -days 365 -nodes \\
  -subj "/CN=DeskLink Server"

# Place certificates
sudo mkdir -p /etc/desklink
sudo cp cert.pem key.pem /etc/desklink/
sudo chmod 600 /etc/desklink/key.pem

# Enable password + SSL
desklink-server --start --password "strong-pass" --ssl`} />
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
        <p className="text-sm text-yellow-300 flex items-start gap-2">
          <i className="fas fa-exclamation-triangle mt-0.5"></i>
          <span>
            <strong>Security Note:</strong> Always enable SSL and set a password when exposing the server beyond your local network. 
            Consider using a VPN for remote connections.
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
      <pre className="bg-gray-900 rounded-xl p-4 pt-10 overflow-x-auto text-sm font-mono text-gray-300 border border-gray-700">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RequirementItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-sm text-gray-200">{value}</p>
    </div>
  );
}
