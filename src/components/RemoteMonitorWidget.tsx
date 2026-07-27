import { useState, useEffect, useRef, useCallback } from 'react';
import { getRemoteSystemStats } from '../lib/tauri';
import type { SshConnection, RemoteSystemStats } from '../types';

interface RemoteMonitorWidgetProps {
  connection: SshConnection | null;
  visible: boolean;
}

export function RemoteMonitorWidget({ connection, visible }: RemoteMonitorWidgetProps) {
  const [stats, setStats] = useState<RemoteSystemStats | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(false);
  const historyRef = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSparkline = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = historyRef.current;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (data.length < 2) return;
    const step = w / (data.length - 1);

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 107, 107, 0)');

    ctx.beginPath();
    ctx.moveTo(0, h - (data[0] / 100) * h);
    data.forEach((v, i) => ctx.lineTo(i * step, h - (v / 100) * h));
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.lineTo((data.length - 1) * step, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, []);

  useEffect(() => {
    if (!visible || !connection) {
      setStats(null);
      setError(false);
      historyRef.current = [];
      return;
    }
    let active = true;

    const poll = async () => {
      try {
        const data = await getRemoteSystemStats(connection);
        if (!active) return;
        setStats(data);
        setError(false);
        historyRef.current = [...historyRef.current.slice(-40), data.cpuUsage];
        drawSparkline();
      } catch {
        if (active) setError(true);
      }
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [connection?.id, visible, drawSparkline]);

  if (!visible || !connection) return null;

  const fmtBytes = (b: number) => {
    if (b >= 1e12) return (b / 1e12).toFixed(1) + ' TB';
    if (b >= 1e9) return (b / 1e9).toFixed(1) + ' GB';
    if (b >= 1e6) return (b / 1e6).toFixed(0) + ' MB';
    return (b / 1e3).toFixed(0) + ' KB';
  };

  const fmtUptime = (sec: number): string => {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    if (d > 0) return `${d}d ${h}h`;
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const ramPct = stats ? (stats.memoryUsed / stats.memoryTotal) * 100 : 0;
  const diskPct = stats ? (stats.diskUsed / stats.diskTotal) * 100 : 0;

  return (
    <div className="remote-monitor-widget">
      <div className="rmon-header" onClick={() => setCollapsed(!collapsed)}>
        <span className={`rmon-dot ${error ? 'error' : 'pulse'}`} />
        <span className="rmon-host">{connection.host}</span>
        <span className="rmon-toggle">{collapsed ? '▲' : '▼'}</span>
      </div>
      {!collapsed && (
        <div className="rmon-body">
          {error ? (
            <div className="rmon-error">⚠ Connection failed</div>
          ) : !stats ? (
            <div className="rmon-loading">Collecting data...</div>
          ) : (
            <>
              <GaugeBar label="CPU" value={stats.cpuUsage} color="#ff6b6b" />
              <GaugeBar
                label="RAM"
                value={ramPct}
                color="#4ecdc4"
                detail={`${fmtBytes(stats.memoryUsed)} / ${fmtBytes(stats.memoryTotal)}`}
              />
              <GaugeBar
                label="Disk"
                value={diskPct}
                color="#ffe66d"
                detail={`${fmtBytes(stats.diskUsed)} / ${fmtBytes(stats.diskTotal)}`}
              />
              <canvas ref={canvasRef} className="rmon-sparkline" width={190} height={32} />
              <div className="rmon-meta">
                Load: {stats.loadAverage.toFixed(2)} · Up: {fmtUptime(stats.uptimeSeconds)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GaugeBar({
  label,
  value,
  color,
  detail,
}: {
  label: string;
  value: number;
  color: string;
  detail?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="rmon-gauge">
      <div className="rmon-gauge-header">
        <span>{label}</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="rmon-gauge-track">
        <div className="rmon-gauge-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {detail && <div className="rmon-gauge-detail">{detail}</div>}
    </div>
  );
}
