import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { systemHealthData, liveMetrics, infraCoverage, aiEngineStatus, initialLogs } from "../data/systemMonitoringData";
import { cn } from "../utils/cn";

export default function GovernmentSystemMonitoring() {
  const [logs, setLogs] = useState(initialLogs);
  const [activeJobs, setActiveJobs] = useState(liveMetrics.predictionJobs);
  const [rps, setRps] = useState(liveMetrics.requestsPerSecond);
  const logEndRef = useRef(null);

  // Auto-append logs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newLogTypes = [
        "Sensor: Node " + Math.floor(Math.random() * 500) + " ping successful.",
        "AI: Localized AQI trend predicted for " + (Math.random() > 0.5 ? "Mumbai" : "Delhi") + ".",
        "DB: Compliance batch " + Math.floor(Math.random() * 1000) + " committed.",
        "Network: Latency spike detected in Eastern gateway.",
        "Satellite: Cloud coverage mask updated.",
      ];
      const randomLog = newLogTypes[Math.floor(Math.random() * newLogTypes.length)];
      setLogs((prev) => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
      
      // Randomize metrics slightly
      setRps((prev) => prev + (Math.floor(Math.random() * 20) - 10));
      setActiveJobs((prev) => Math.max(0, prev + (Math.floor(Math.random() * 3) - 1)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const [controlLoading, setControlLoading] = useState(null);

  const triggerAction = (action) => {
    setControlLoading(action);
    setTimeout(() => setControlLoading(null), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 bg-background-dark text-text-primary space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-text-primary flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">monitoring</span>
            System Infrastructure Monitoring
          </h2>
          <p className="text-text-secondary text-sm font-medium mt-1">Real-time telemetry and control for PrithviNet National Grid.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Telemetry</span>
          </div>
          <span className="text-xs font-mono text-text-muted">{new Date().toUTCString()}</span>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {systemHealthData.map((item) => (
          <Card key={item.id} className="!rounded-none border-l-2 border-l-primary flex flex-col gap-3 p-4 bg-surface/30">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.name}</span>
              <Badge variant={item.status === 'Online' ? 'success' : 'warning'} className="!text-[8px]">{item.status}</Badge>
            </div>
            <div>
              <p className="text-2xl font-black font-mono tracking-tighter">{item.uptime}</p>
              <p className="text-[10px] text-text-muted">Uptime (24h)</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-[10px] font-medium text-text-secondary">Load: {item.load}</span>
              <span className="text-[10px] font-medium text-text-muted">{item.lastUpdate}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Metrics Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="!rounded-none border border-border bg-surface/20 p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">analytics</span>
              Operational Telemetry
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-3xl font-black font-mono text-primary tracking-tighter">{rps}</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Req / Sec</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black font-mono text-text-primary tracking-tighter">{liveMetrics.activeNodes}</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Active Nodes</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black font-mono text-text-primary tracking-tighter">{liveMetrics.alertsProcessed}</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Alerts / Day</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black font-mono text-orange-500 tracking-tighter">{activeJobs}</p>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Active Jobs</p>
              </div>
            </div>
          </Card>

          {/* Infrastructure Coverage */}
          <Card className="!rounded-none border border-border bg-surface/20 p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6">Regional Node Health</h3>
            <div className="space-y-4">
              {infraCoverage.map((region) => (
                <div key={region.region} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm font-bold w-32">{region.region}</span>
                    <div className="flex-1 h-1.5 bg-panel rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          region.status === 'Healthy' ? 'bg-primary' : region.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: region.coverage }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-8">
                    <span className="text-xs font-mono font-bold w-12 text-right">{region.coverage}</span>
                    <Badge variant={region.status === 'Healthy' ? 'success' : 'warning'} className="w-20 text-center !py-0.5">{region.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Logs Panel */}
        <Card className="!rounded-none border border-border bg-panel flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-surface/10 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Kernel Logs</h3>
            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div className="flex-1 p-4 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar bg-black/40">
            {logs.map((log, i) => (
              <div key={i} className="text-text-secondary border-l border-border/30 pl-2 py-0.5 hover:bg-white/5 transition-colors">
                <span className="text-primary opacity-70 mr-2">➜</span>
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Engine Block */}
        <Card className="!rounded-none border border-border bg-surface/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">AI Infrastructure</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-panel border border-border/50">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-1">Model Version</p>
              <p className="text-sm font-black">{aiEngineStatus.modelVersion}</p>
            </div>
            <div className="p-3 bg-panel border border-border/50">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-1">Accuracy</p>
              <p className="text-sm font-black text-primary">{aiEngineStatus.accuracy}</p>
            </div>
            <div className="p-3 bg-panel border border-border/50">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-1">Last Trained</p>
              <p className="text-sm font-black">{aiEngineStatus.lastTraining}</p>
            </div>
            <div className="p-3 bg-panel border border-border/50">
              <p className="text-[8px] font-bold text-text-muted uppercase mb-1">Next Retrain</p>
              <p className="text-sm font-black text-orange-500">{aiEngineStatus.nextRetrain}</p>
            </div>
          </div>
        </Card>

        {/* Emergency Controls */}
        <Card className="lg:col-span-2 !rounded-none border border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-red-500">lock_open</span>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500/80">Command & Control (Override)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="!rounded-none border-border hover:bg-panel uppercase font-black tracking-widest text-[10px] py-4"
              onClick={() => triggerAction('restart')}
              disabled={controlLoading !== null}
            >
              {controlLoading === 'restart' ? "Restarting..." : "Restart Sensor Network"}
            </Button>
            <Button 
              variant="outline" 
              className="!rounded-none border-border hover:bg-panel uppercase font-black tracking-widest text-[10px] py-4"
              onClick={() => triggerAction('pause')}
              disabled={controlLoading !== null}
            >
              {controlLoading === 'pause' ? "Pausing..." : "Pause AI Predictions"}
            </Button>
            <Button 
              variant="outline" 
              className="!rounded-none border-border hover:bg-panel uppercase font-black tracking-widest text-[10px] py-4"
              onClick={() => triggerAction('sync')}
              disabled={controlLoading !== null}
            >
              {controlLoading === 'sync' ? "Syncing..." : "Force Data Sync"}
            </Button>
            <Button 
              variant="primary" 
              className="!rounded-none uppercase font-black tracking-widest text-[10px] py-4 shadow-lg shadow-primary/20"
              onClick={() => triggerAction('scan')}
              disabled={controlLoading !== null}
            >
              {controlLoading === 'scan' ? "Scanning..." : "Trigger Nationwide Scan"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
