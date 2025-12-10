import React, { useState } from 'react';
import { Server, Code, Cog, AlertCircle, CheckCircle, Play, FileCode, Zap } from 'lucide-react';

const AdvancedScripting = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [currentDemo, setCurrentDemo] = useState(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const sections = [
    { id: 'intro', name: '1. Introduction', icon: FileCode },
    { id: 'functions', name: '2. Advanced Functions', icon: Code },
    { id: 'error', name: '3. Error Handling', icon: AlertCircle },
    { id: 'services', name: '4. Building Services', icon: Server },
    { id: 'monitoring', name: '5. Process Monitoring', icon: Cog },
    { id: 'automation', name: '6. Task Automation', icon: Zap },
    { id: 'integration', name: '7. Service Integration', icon: CheckCircle }
  ];

  const errorHandlingPatterns = [
    {
      name: 'Exit on Error',
      code: `#!/bin/bash
set -e  # Exit immediately if any command fails
set -u  # Treat unset variables as errors
set -o pipefail  # Catch errors in pipes

echo "Starting process..."
command_that_might_fail
echo "This won't run if previous command failed"`,
      explanation: 'Strict mode prevents silent failures'
    },
    {
      name: 'Trap Errors',
      code: `#!/bin/bash
cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/tempfile
  kill $PID 2>/dev/null
}

trap cleanup EXIT ERR

# Your code here
PID=$!`,
      explanation: 'Automatic cleanup on exit or error'
    },
    {
      name: 'Check Return Codes',
      code: `#!/bin/bash
if ! command_that_might_fail; then
  echo "Error: Command failed" >&2
  exit 1
fi

# OR check $?
command
if [ $? -ne 0 ]; then
  echo "Error detected!"
  exit 1
fi`,
      explanation: 'Explicit error checking and handling'
    },
    {
      name: 'Logging',
      code: `#!/bin/bash
LOG_FILE="/var/log/myservice.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "INFO: Service starting"
log "ERROR: Connection failed"`,
      explanation: 'Structured logging for debugging'
    }
  ];

  const serviceTemplate = `#!/bin/bash
### System Service Template ###

# Configuration
SERVICE_NAME="myapp"
PID_FILE="/var/run/$SERVICE_NAME.pid"
LOG_FILE="/var/log/$SERVICE_NAME.log"
APP_DIR="/opt/$SERVICE_NAME"
APP_BIN="$APP_DIR/app"

# Logging function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: Must run as root"
  exit 1
fi

# Start function
start() {
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      log "ERROR: Service already running (PID: $PID)"
      return 1
    else
      log "WARN: Removing stale PID file"
      rm -f "$PID_FILE"
    fi
  fi
  
  log "INFO: Starting $SERVICE_NAME..."
  cd "$APP_DIR"
  nohup "$APP_BIN" >> "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  
  sleep 2
  if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
    log "INFO: Service started successfully (PID: $(cat $PID_FILE))"
    return 0
  else
    log "ERROR: Service failed to start"
    rm -f "$PID_FILE"
    return 1
  fi
}

# Stop function
stop() {
  if [ ! -f "$PID_FILE" ]; then
    log "WARN: Service not running (no PID file)"
    return 1
  fi
  
  PID=$(cat "$PID_FILE")
  if ! ps -p $PID > /dev/null 2>&1; then
    log "WARN: Service not running (stale PID file)"
    rm -f "$PID_FILE"
    return 1
  fi
  
  log "INFO: Stopping $SERVICE_NAME (PID: $PID)..."
  kill $PID
  
  # Wait for graceful shutdown
  for i in {1..10}; do
    if ! ps -p $PID > /dev/null 2>&1; then
      log "INFO: Service stopped successfully"
      rm -f "$PID_FILE"
      return 0
    fi
    sleep 1
  done
  
  # Force kill if still running
  log "WARN: Force killing service"
  kill -9 $PID 2>/dev/null
  rm -f "$PID_FILE"
  return 0
}

# Status function
status() {
  if [ ! -f "$PID_FILE" ]; then
    echo "$SERVICE_NAME is not running"
    return 3
  fi
  
  PID=$(cat "$PID_FILE")
  if ps -p $PID > /dev/null 2>&1; then
    echo "$SERVICE_NAME is running (PID: $PID)"
    return 0
  else
    echo "$SERVICE_NAME is dead but PID file exists"
    return 1
  fi
}

# Restart function
restart() {
  stop
  sleep 2
  start
}

# Main logic
case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exit $?`;

  const monitoringScript = `#!/bin/bash
### Process Monitoring & Auto-Recovery ###

SERVICE_NAME="myapp"
CHECK_INTERVAL=30
MAX_RETRIES=3
ALERT_EMAIL="admin@example.com"

monitor() {
  retry_count=0
  
  while true; do
    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
      echo "[$(date)] Service $SERVICE_NAME is down!"
      
      retry_count=$((retry_count + 1))
      
      if [ $retry_count -le $MAX_RETRIES ]; then
        echo "Attempting restart ($retry_count/$MAX_RETRIES)..."
        systemctl restart "$SERVICE_NAME"
        sleep 5
        
        if systemctl is-active --quiet "$SERVICE_NAME"; then
          echo "Service recovered successfully"
          retry_count=0
          
          # Send recovery notification
          echo "Service recovered at $(date)" | \\
            mail -s "[$SERVICE_NAME] Recovery" $ALERT_EMAIL
        fi
      else
        echo "Max retries exceeded. Manual intervention required."
        
        # Send critical alert
        echo "Service failed after $MAX_RETRIES attempts" | \\
          mail -s "[$SERVICE_NAME] CRITICAL" $ALERT_EMAIL
        
        retry_count=0
      fi
    else
      retry_count=0
    fi
    
    sleep $CHECK_INTERVAL
  done
}

# Health check function
health_check() {
  local endpoint="http://localhost:8080/health"
  
  if curl -s -f "$endpoint" > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Resource monitoring
check_resources() {
  local pid=$(systemctl show -p MainPID "$SERVICE_NAME" | cut -d= -f2)
  
  if [ "$pid" -gt 0 ]; then
    # Get CPU and memory usage
    local cpu=$(ps -p $pid -o %cpu --no-headers)
    local mem=$(ps -p $pid -o %mem --no-headers)
    
    echo "CPU: $cpu% | Memory: $mem%"
    
    # Alert if thresholds exceeded
    if (( $(echo "$cpu > 80" | bc -l) )); then
      echo "WARNING: High CPU usage: $cpu%"
    fi
    
    if (( $(echo "$mem > 80" | bc -l) )); then
      echo "WARNING: High memory usage: $mem%"
    fi
  fi
}

# Start monitoring
monitor`;

  const automationExamples = [
    {
      title: 'Log Rotation Script',
      code: `#!/bin/bash
# Rotate logs daily, keep 7 days

LOG_DIR="/var/log/myapp"
RETENTION_DAYS=7

rotate_logs() {
  cd "$LOG_DIR"
  
  # Compress yesterday's log
  if [ -f "app.log" ]; then
    mv app.log "app.log.$(date -d yesterday +%Y%m%d)"
    gzip "app.log.$(date -d yesterday +%Y%m%d)"
  fi
  
  # Create new log
  touch app.log
  chmod 644 app.log
  
  # Delete old logs
  find . -name "app.log.*.gz" -mtime +$RETENTION_DAYS -delete
}

rotate_logs`,
      description: 'Automated log rotation with compression'
    },
    {
      title: 'Database Backup Script',
      code: `#!/bin/bash
# Automated database backup

DB_NAME="myapp_db"
DB_USER="backup_user"
BACKUP_DIR="/backup/db"
RETENTION_DAYS=30

backup_database() {
  local timestamp=$(date +%Y%m%d_%H%M%S)
  local backup_file="$BACKUP_DIR/\${DB_NAME}_\${timestamp}.sql.gz"
  
  # Create backup
  mysqldump -u "$DB_USER" "$DB_NAME" | gzip > "$backup_file"
  
  if [ $? -eq 0 ]; then
    echo "Backup created: $backup_file"
    
    # Verify backup
    if [ -s "$backup_file" ]; then
      # Delete old backups
      find "$BACKUP_DIR" -name "\${DB_NAME}_*.sql.gz" \\
        -mtime +$RETENTION_DAYS -delete
    else
      echo "ERROR: Backup file is empty!"
      return 1
    fi
  else
    echo "ERROR: Backup failed!"
    return 1
  fi
}

backup_database`,
      description: 'Database backup with verification and retention'
    },
    {
      title: 'System Health Report',
      code: `#!/bin/bash
# Daily system health report

REPORT_FILE="/tmp/health_report_$(date +%Y%m%d).txt"

{
  echo "=== System Health Report ==="
  echo "Date: $(date)"
  echo ""
  
  echo "== Disk Usage =="
  df -h | grep -v tmpfs
  echo ""
  
  echo "== Memory Usage =="
  free -h
  echo ""
  
  echo "== CPU Load =="
  uptime
  echo ""
  
  echo "== Service Status =="
  for service in nginx mysql redis; do
    if systemctl is-active --quiet $service; then
      echo "$service: RUNNING"
    else
      echo "$service: STOPPED"
    fi
  done
  echo ""
  
  echo "== Failed Services =="
  systemctl --failed
  
} > "$REPORT_FILE"

# Email report
mail -s "Daily Health Report" admin@example.com < "$REPORT_FILE"`,
      description: 'Comprehensive system health monitoring'
    }
  ];

  const integrationExample = `#!/bin/bash
### Multi-Service Integration Script ###

# Service configuration
WEB_SERVICE="nginx"
APP_SERVICE="myapp"
DB_SERVICE="mysql"
CACHE_SERVICE="redis"

# Dependency order
SERVICES=("$DB_SERVICE" "$CACHE_SERVICE" "$APP_SERVICE" "$WEB_SERVICE")

# Start all services in order
start_all() {
  echo "Starting services in dependency order..."
  
  for service in "\${SERVICES[@]}"; do
    echo "Starting $service..."
    systemctl start $service
    
    # Wait for service to be ready
    sleep 2
    
    if systemctl is-active --quiet $service; then
      echo "✓ $service started successfully"
    else
      echo "✗ $service failed to start"
      echo "Stopping previously started services..."
      stop_all
      return 1
    fi
  done
  
  echo "All services started successfully!"
  return 0
}

# Stop all services in reverse order
stop_all() {
  echo "Stopping services..."
  
  # Reverse array
  for ((i=\${#SERVICES[@]}-1; i>=0; i--)); do
    service="\${SERVICES[$i]}"
    echo "Stopping $service..."
    systemctl stop $service
  done
  
  echo "All services stopped"
}

# Health check all services
health_check_all() {
  local all_healthy=true
  
  for service in "\${SERVICES[@]}"; do
    if systemctl is-active --quiet $service; then
      echo "✓ $service: healthy"
    else
      echo "✗ $service: unhealthy"
      all_healthy=false
    fi
  done
  
  if $all_healthy; then
    echo ""
    echo "All services are healthy!"
    return 0
  else
    echo ""
    echo "Some services are unhealthy!"
    return 1
  fi
}

# Deployment script
deploy() {
  local version=$1
  
  if [ -z "$version" ]; then
    echo "Usage: $0 deploy <version>"
    return 1
  fi
  
  echo "Deploying version $version..."
  
  # Stop application
  systemctl stop $APP_SERVICE
  
  # Backup current version
  cp -r /opt/myapp /opt/myapp.backup
  
  # Deploy new version
  cd /opt
  wget "https://releases.example.com/myapp-$version.tar.gz"
  tar -xzf "myapp-$version.tar.gz"
  
  # Update symlink
  rm -f myapp
  ln -s "myapp-$version" myapp
  
  # Start application
  systemctl start $APP_SERVICE
  
  # Verify deployment
  sleep 5
  if health_check_all; then
    echo "Deployment successful!"
    rm -rf /opt/myapp.backup
    return 0
  else
    echo "Deployment failed! Rolling back..."
    systemctl stop $APP_SERVICE
    rm -rf /opt/myapp
    mv /opt/myapp.backup /opt/myapp
    systemctl start $APP_SERVICE
    return 1
  fi
}

# Main command handler
case "$1" in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  restart)
    stop_all
    sleep 2
    start_all
    ;;
  status)
    health_check_all
    ;;
  deploy)
    deploy "$2"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|deploy <version>}"
    exit 1
    ;;
esac`;

  const advancedPatterns = [
    {
      title: 'Parallel Execution',
      code: `#!/bin/bash
# Run multiple tasks in parallel

process_file() {
  local file=$1
  echo "Processing $file..."
  # Long-running task
  sleep 2
  echo "$file done"
}

export -f process_file

# Process all files in parallel (max 4 at a time)
find /data -name "*.txt" | xargs -P 4 -I {} bash -c 'process_file "$@"' _ {}`,
      concept: 'Use xargs -P for parallel processing'
    },
    {
      title: 'Locking Mechanism',
      code: `#!/bin/bash
# Prevent concurrent execution

LOCK_FILE="/var/lock/myscript.lock"

# Acquire lock
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  echo "Another instance is running"
  exit 1
fi

# Your code here
echo "Running exclusively..."
sleep 10

# Lock released automatically on exit`,
      concept: 'Prevent multiple instances with flock'
    },
    {
      title: 'Configuration Management',
      code: `#!/bin/bash
# Load configuration from file

CONFIG_FILE="/etc/myapp/config.conf"

# Default values
DB_HOST="localhost"
DB_PORT=3306
LOG_LEVEL="INFO"

# Load config if exists
if [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
fi

# Use configuration
echo "Connecting to $DB_HOST:$DB_PORT"
echo "Log level: $LOG_LEVEL"

# Or use env vars with defaults
DB_HOST=\${DB_HOST:-localhost}
DB_PORT=\${DB_PORT:-3306}`,
      concept: 'External configuration with defaults'
    },
    {
      title: 'Signal Handling',
      code: `#!/bin/bash
# Graceful shutdown on signals

cleanup() {
  echo "Received shutdown signal"
  kill $WORKER_PID 2>/dev/null
  echo "Cleanup complete"
  exit 0
}

trap cleanup SIGTERM SIGINT

# Start background worker
worker &
WORKER_PID=$!

# Wait for signals
wait $WORKER_PID`,
      concept: 'Handle SIGTERM/SIGINT gracefully'
    }
  ];

  const systemdService = `# /etc/systemd/system/myapp.service
[Unit]
Description=My Application Service
After=network.target mysql.service redis.service
Requires=mysql.service

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/bin/start.sh
ExecStop=/opt/myapp/bin/stop.sh
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

# Resource limits
LimitNOFILE=65536
MemoryLimit=2G
CPUQuota=200%

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/var/lib/myapp /var/log/myapp

[Install]
WantedBy=multi-user.target`;

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🚀 Advanced Bash Scripting</h2>
        <p className="text-lg">Build production-ready services on Linux servers</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">🎯 Module Objectives</h3>
        <p className="text-blue-700 mb-3">
          You've learned the basics in Module 3 (Linux Essentials). Now you'll learn to build
          and manage real services for your assignment - including error handling, monitoring,
          and automation.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Prerequisites:</strong> Linux Essentials (Module 3), Process Concurrency, File Systems
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Server className="text-green-500" /> Building Services
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Start/stop/restart service control</li>
            <li>• PID file management</li>
            <li>• Daemon processes</li>
            <li>• Systemd integration</li>
            <li>• Health checks & status reporting</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="text-red-500" /> Error Handling
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Strict mode (set -e, set -u)</li>
            <li>• Trap handlers for cleanup</li>
            <li>• Return code checking</li>
            <li>• Structured logging</li>
            <li>• Graceful failure</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Cog className="text-blue-500" /> Process Monitoring
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Auto-recovery mechanisms</li>
            <li>• Resource monitoring (CPU, memory)</li>
            <li>• Health endpoint checks</li>
            <li>• Alert notifications</li>
            <li>• Retry logic with backoff</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Zap className="text-yellow-500" /> Automation
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Log rotation & cleanup</li>
            <li>• Automated backups</li>
            <li>• Scheduled tasks (cron)</li>
            <li>• Deployment scripts</li>
            <li>• System health reports</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">💡 Real-World Application</h3>
        <p className="text-yellow-700">
          These patterns are used in production systems at companies like Netflix, Amazon, and Google.
          Your assignment will require you to build a service that can start, stop, monitor itself,
          and recover from failures automatically.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
        <h3 className="font-bold text-lg mb-3">📚 What You'll Build</h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <strong>Service Control Script:</strong> Start, stop, restart, and check status of your application
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <strong>Monitoring Daemon:</strong> Automatically detect and recover from service failures
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <strong>Automation Scripts:</strong> Log rotation, backups, and health reports
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
            <div>
              <strong>Integration System:</strong> Manage multiple dependent services together
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunctions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Advanced Functions & Code Organization</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Function Best Practices</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          <div className="text-blue-400"># Use local variables</div>
          <div>process_data() {'{'}</div>
          <div>  local input_file=$1</div>
          <div>  local output_file=$2</div>
          <div>  local temp_file=$(mktemp)</div>
          <div>  </div>
          <div className="text-blue-400">  # Validate inputs</div>
          <div>  if [ -z "$input_file" ] || [ -z "$output_file" ]; then</div>
          <div>    echo "Error: Missing arguments" &gt;&2</div>
          <div>    return 1</div>
          <div>  fi</div>
          <div>  </div>
          <div className="text-blue-400">  # Process data</div>
          <div>  grep "pattern" "$input_file" &gt; "$temp_file"</div>
          <div>  sort "$temp_file" &gt; "$output_file"</div>
          <div>  </div>
          <div className="text-blue-400">  # Cleanup</div>
          <div>  rm -f "$temp_file"</div>
          <div>  return 0</div>
          <div>{'}'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Library Functions</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="text-blue-400"># lib/common.sh</div>
            <div></div>
            <div>log_info() {'{'}</div>
            <div>  echo "[INFO] $(date '+%H:%M:%S') $*"</div>
            <div>{'}'}</div>
            <div></div>
            <div>log_error() {'{'}</div>
            <div>  echo "[ERROR] $(date '+%H:%M:%S') $*" &gt;&2</div>
            <div>{'}'}</div>
            <div></div>
            <div>check_root() {'{'}</div>
            <div>  if [ "$EUID" -ne 0 ]; then</div>
            <div>    log_error "Must run as root"</div>
            <div>    exit 1</div>
            <div>  fi</div>
            <div>{'}'}</div>
            <div></div>
            <div className="text-blue-400"># In main script:</div>
            <div>source lib/common.sh</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Return Values</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div>is_service_running() {'{'}</div>
            <div>  local service=$1</div>
            <div>  systemctl is-active --quiet "$service"</div>
            <div>  return $?  <span className="text-gray-500"># 0=running, !0=not</span></div>
            <div>{'}'}</div>
            <div></div>
            <div className="text-blue-400"># Usage:</div>
            <div>if is_service_running "nginx"; then</div>
            <div>  echo "Nginx is running"</div>
            <div>else</div>
            <div>  echo "Nginx is stopped"</div>
            <div>fi</div>
            <div></div>
            <div className="text-blue-400"># Capture output:</div>
            <div>result=$(my_function "$arg")</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Complex Conditionals</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Multiple Conditions</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>if [ -f "$file" ] && [ -r "$file" ]; then</div>
              <div>  echo "File exists and is readable"</div>
              <div>fi</div>
              <div></div>
              <div>if [[ -f "$file" && -r "$file" ]]; then  <span className="text-gray-500"># Better syntax</span></div>
              <div>  echo "Same result"</div>
              <div>fi</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Pattern Matching</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>if [[ "$filename" == *.txt ]]; then</div>
              <div>  echo "Text file"</div>
              <div>fi</div>
              <div></div>
              <div>if [[ "$string" =~ ^[0-9]+$ ]]; then</div>
              <div>  echo "String is numeric"</div>
              <div>fi</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Case Statement</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>case "$environment" in</div>
              <div>  production|prod)</div>
              <div>    LOG_LEVEL="ERROR"</div>
              <div>    ;;</div>
              <div>  staging|stage)</div>
              <div>    LOG_LEVEL="WARN"</div>
              <div>    ;;</div>
              <div>  development|dev)</div>
              <div>    LOG_LEVEL="DEBUG"</div>
              <div>    ;;</div>
              <div>  *)</div>
              <div>    echo "Unknown environment"</div>
              <div>    exit 1</div>
              <div>    ;;</div>
              <div>esac</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Error Handling & Debugging</h2>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <h3 className="font-bold text-red-800 mb-2">⚠️ Why Error Handling Matters</h3>
        <p className="text-red-700">
          In production, silent failures are the worst kind. Your service must detect errors,
          log them properly, clean up resources, and either recover or fail gracefully.
        </p>
      </div>

      <div className="space-y-6">
        {errorHandlingPatterns.map((pattern, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-3">{pattern.name}</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm mb-3 whitespace-pre">
              {pattern.code}
            </div>
            <p className="text-gray-700">{pattern.explanation}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-yellow-200">
        <h3 className="font-bold text-lg mb-4">Debugging Techniques</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Enable Debug Mode</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>#!/bin/bash</div>
              <div>set -x  <span className="text-gray-500"># Print each command before executing</span></div>
              <div></div>
              <div>echo "This will be traced"</div>
              <div>ls -la</div>
              <div></div>
              <div>set +x  <span className="text-gray-500"># Disable tracing</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Log Everything</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>exec 1&gt; &gt;(tee -a "$LOG_FILE")</div>
              <div>exec 2&gt; &gt;(tee -a "$LOG_FILE" &gt;&2)</div>
              <div></div>
              <div className="text-gray-500"># Now all stdout and stderr go to log file AND terminal</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Check Syntax</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>bash -n script.sh  <span className="text-gray-500"># Check syntax without running</span></div>
              <div>shellcheck script.sh  <span className="text-gray-500"># Advanced linting</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Building Production Services</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
        <h3 className="font-bold text-lg mb-4">Complete Service Control Script</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto whitespace-pre">
          {serviceTemplate}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Systemd Integration</h3>
        <p className="text-gray-700 mb-4">
          Modern Linux uses systemd to manage services. Here's how to integrate your script:
        </p>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre mb-4">
          {systemdService}
        </div>
        <div className="space-y-2 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <strong>Install:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded font-mono">
              sudo cp myapp.service /etc/systemd/system/
            </code>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <strong>Enable:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded font-mono">
              sudo systemctl enable myapp
            </code>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <strong>Start:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded font-mono">
              sudo systemctl start myapp
            </code>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <strong>Check logs:</strong>
            <code className="ml-2 bg-white px-2 py-1 rounded font-mono">
              sudo journalctl -u myapp -f
            </code>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded border-2 border-green-200">
          <h4 className="font-bold text-green-800 mb-3">✅ Best Practices</h4>
          <ul className="space-y-1 text-sm text-green-700">
            <li>• Always check PID file validity</li>
            <li>• Implement graceful shutdown</li>
            <li>• Log all state changes</li>
            <li>• Verify service health after start</li>
            <li>• Clean up stale resources</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-3">⚠️ Common Pitfalls</h4>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>• Not checking if already running</li>
            <li>• Ignoring SIGTERM signals</li>
            <li>• Hard-coded paths</li>
            <li>• No timeout on shutdown</li>
            <li>• Missing error logging</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded border-2 border-red-200">
          <h4 className="font-bold text-red-800 mb-3">🚫 Never Do This</h4>
          <ul className="space-y-1 text-sm text-red-700">
            <li>• kill -9 immediately</li>
            <li>• Ignore exit codes</li>
            <li>• Run as root unnecessarily</li>
            <li>• Store passwords in scripts</li>
            <li>• Skip input validation</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Process Monitoring & Auto-Recovery</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Monitoring Script with Auto-Recovery</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto whitespace-pre">
          {monitoringScript}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Resource Monitoring</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div>#!/bin/bash</div>
            <div className="text-blue-400"># Monitor CPU and Memory</div>
            <div></div>
            <div>SERVICE="myapp"</div>
            <div>CPU_THRESHOLD=80</div>
            <div>MEM_THRESHOLD=80</div>
            <div></div>
            <div>PID=$(pgrep -f $SERVICE)</div>
            <div></div>
            <div>if [ -n "$PID" ]; then</div>
            <div>  CPU=$(ps -p $PID -o %cpu --no-headers)</div>
            <div>  MEM=$(ps -p $PID -o %mem --no-headers)</div>
            <div>  </div>
            <div>  if (( $(echo "$CPU &gt; $CPU_THRESHOLD" | bc) )); then</div>
            <div>    alert "High CPU: $CPU%"</div>
            <div>  fi</div>
            <div>  </div>
            <div>  if (( $(echo "$MEM &gt; $MEM_THRESHOLD" | bc) )); then</div>
            <div>    alert "High Memory: $MEM%"</div>
            <div>  fi</div>
            <div>fi</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold text-lg mb-4">Health Checks</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div>#!/bin/bash</div>
            <div className="text-blue-400"># HTTP health check</div>
            <div></div>
            <div>check_health() {'{'}</div>
            <div>  local url=$1</div>
            <div>  local timeout=5</div>
            <div>  </div>
            <div>  response=$(curl -s -o /dev/null \\</div>
            <div>    -w "%{'{http_code}'}" \\</div>
            <div>    --max-time $timeout \\</div>
            <div>    "$url")</div>
            <div>  </div>
            <div>  if [ "$response" = "200" ]; then</div>
            <div>    return 0</div>
            <div>  else</div>
            <div>    return 1</div>
            <div>  fi</div>
            <div>{'}'}</div>
            <div></div>
            <div>if check_health "http://localhost:8080/health"; then</div>
            <div>  echo "Service healthy"</div>
            <div>else</div>
            <div>  echo "Service unhealthy!"</div>
            <div>fi</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">💡 Monitoring Strategies</h3>
        <div className="space-y-2 text-blue-700 text-sm">
          <div>
            <strong>1. Active Monitoring:</strong> Periodically check if service is running and responding
          </div>
          <div>
            <strong>2. Resource Monitoring:</strong> Track CPU, memory, disk usage
          </div>
          <div>
            <strong>3. Log Monitoring:</strong> Watch for error patterns in logs
          </div>
          <div>
            <strong>4. Health Endpoints:</strong> Service exposes /health for status checks
          </div>
          <div>
            <strong>5. Auto-Recovery:</strong> Automatic restart with exponential backoff
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Task Automation</h2>

      <div className="space-y-6">
        {automationExamples.map((example, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-3">{example.title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{example.description}</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre">
              {example.code}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
        <h3 className="font-bold text-lg mb-4">Scheduling with Cron</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Cron Format</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div>* * * * * command</div>
              <div className="text-gray-500">│ │ │ │ │</div>
              <div className="text-gray-500">│ │ │ │ └─── Day of week (0-7, 0 and 7 = Sunday)</div>
              <div className="text-gray-500">│ │ │ └───── Month (1-12)</div>
              <div className="text-gray-500">│ │ └─────── Day of month (1-31)</div>
              <div className="text-gray-500">│ └───────── Hour (0-23)</div>
              <div className="text-gray-500">└─────────── Minute (0-59)</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Common Cron Examples</h4>
            <div className="space-y-2">
              {[
                { schedule: '0 2 * * *', desc: 'Daily at 2 AM', use: 'Daily backups' },
                { schedule: '*/5 * * * *', desc: 'Every 5 minutes', use: 'Health checks' },
                { schedule: '0 0 * * 0', desc: 'Weekly on Sunday', use: 'Weekly reports' },
                { schedule: '0 0 1 * *', desc: 'Monthly on 1st', use: 'Monthly cleanup' },
                { schedule: '0 */4 * * *', desc: 'Every 4 hours', use: 'Log rotation' }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded flex items-center gap-4">
                  <code className="bg-blue-600 text-white px-3 py-1 rounded font-mono text-sm min-w-[120px]">
                    {item.schedule}
                  </code>
                  <div className="flex-1">
                    <div className="font-medium">{item.desc}</div>
                    <div className="text-sm text-gray-600">{item.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Install Cron Job</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              <div className="text-blue-400"># Edit crontab</div>
              <div>crontab -e</div>
              <div></div>
              <div className="text-blue-400"># Add line:</div>
              <div>0 2 * * * /opt/myapp/scripts/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&1</div>
              <div></div>
              <div className="text-blue-400"># List current cron jobs</div>
              <div>crontab -l</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegration = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Multi-Service Integration</h2>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold text-lg mb-4">Complete Integration Script</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto whitespace-pre">
          {integrationExample}
        </div>
      </div>

      <div className="space-y-6">
        {advancedPatterns.map((pattern, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-3">{pattern.title}</h3>
            <p className="text-sm text-gray-600 mb-3 italic">{pattern.concept}</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre">
              {pattern.code}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h3 className="font-bold text-green-800 mb-2">🎯 Assignment Checklist</h3>
        <div className="space-y-2 text-green-700">
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Service can start, stop, restart, and report status</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>PID file management prevents duplicate instances</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Graceful shutdown with timeout and force-kill fallback</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Structured logging with timestamps</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Error handling with proper exit codes</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Monitoring with auto-recovery</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="mt-1 flex-shrink-0" size={16} />
            <span>Integration with systemd (bonus)</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">📚 Further Reading</h3>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• <code className="bg-white px-2 py-1 rounded">man systemd.service</code> - Systemd service documentation</li>
          <li>• <code className="bg-white px-2 py-1 rounded">man bash</code> - Complete bash reference</li>
          <li>• <a href="#" className="underline">Google SRE Book</a> - Industry best practices</li>
          <li>• <code className="bg-white px-2 py-1 rounded">journalctl</code> - View systemd logs</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 mb-6">
          <h1 className="text-4xl font-bold mb-2">🚀 Advanced Bash Scripting</h1>
          <p className="text-xl text-purple-100">Building Production-Ready Linux Services</p>
          <p className="text-sm text-purple-200 mt-2">
            Functions, error handling, monitoring, automation, and service integration
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition \${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeSection === 'intro' && renderIntro()}
          {activeSection === 'functions' && renderFunctions()}
          {activeSection === 'error' && renderError()}
          {activeSection === 'services' && renderServices()}
          {activeSection === 'monitoring' && renderMonitoring()}
          {activeSection === 'automation' && renderAutomation()}
          {activeSection === 'integration' && renderIntegration()}
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">
            {activeSection === 'intro' && 'Build production-ready services for your assignment'}
            {activeSection === 'integration' && 'You now have all the tools to build robust services!'}
          </div>
          <div className="text-sm text-purple-400">
            Position #9 in Learning Path
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedScripting;
