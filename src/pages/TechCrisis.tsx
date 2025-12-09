import { useState, useEffect, useCallback, useMemo } from "react";
import { mockIncidents } from "@/data/techCrisis";
import { Incident, IncidentDataResponse } from "@/types/crisis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertTriangle, AlertCircle, Bell, CheckCircle2, Clock, RefreshCw, Server, XCircle, Zap, Activity, Shield, Target, ChevronDown, ChevronUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import NonTechCrisisView from "@/components/crisis/NonTechCrisisView";
const REFRESH_INTERVAL = 10 * 1000; // 10 seconds

const severityConfig: Record<string, {
  icon: typeof AlertCircle;
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  P0: {
    icon: XCircle,
    label: "Critical",
    color: "text-status-critical",
    bg: "bg-status-critical/10",
    border: "border-status-critical/30"
  },
  P1: {
    icon: AlertTriangle,
    label: "High",
    color: "text-status-warning",
    bg: "bg-status-warning/10",
    border: "border-status-warning/30"
  },
  P2: {
    icon: AlertCircle,
    label: "Medium",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30"
  },
  P3: {
    icon: Bell,
    label: "Low",
    color: "text-status-success",
    bg: "bg-status-success/10",
    border: "border-status-success/30"
  }
};
const statusConfig: Record<string, {
  color: string;
  bg: string;
}> = {
  active: {
    color: "text-status-critical",
    bg: "bg-status-critical/10"
  },
  investigating: {
    color: "text-status-warning",
    bg: "bg-status-warning/10"
  },
  resolved: {
    color: "text-status-success",
    bg: "bg-status-success/10"
  }
};
const ITEMS_PER_PAGE = 10;

// Helper to flatten incidents from the nested structure
const flattenIncidents = (data: IncidentDataResponse[]): Incident[] => {
  return data.flatMap(group => group.data.incidents);
};

// Helper to render text with **bold** markdown
const renderWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
};
export default function TechCrisis() {
  const [incidents, setIncidents] = useState<Incident[]>(() => flattenIncidents(mockIncidents));
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("active");
  const [viewMode, setViewMode] = useState<"tech" | "non-tech">("non-tech");
  const [currentPage, setCurrentPage] = useState(1);
  const loadData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIncidents(flattenIncidents(mockIncidents));
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);
  useEffect(() => {
    const interval = setInterval(loadData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);
  const toggleExpanded = (id: string) => {
    setExpandedIncidents(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter incidents based on tab
  const activeIncidents = useMemo(() => incidents.filter(i => i.status === "active"), [incidents]);

  // Pagination for all issues
  const totalPages = Math.ceil(incidents.length / ITEMS_PER_PAGE);
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return incidents.slice(start, start + ITEMS_PER_PAGE);
  }, [incidents, currentPage]);

  // Reset page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Stats
  const p0Count = incidents.filter(i => i.severity === "P0").length;
  const p1Count = incidents.filter(i => i.severity === "P1").length;
  const p2Count = incidents.filter(i => i.severity === "P2").length;
  const activeCount = incidents.filter(i => i.status === "active").length;
  const totalAlerts = incidents.reduce((acc, i) => acc + i.alert_count, 0);
  const avgConfidence = useMemo(() => {
    const withAnalysis = incidents.filter(i => i.analysis?.confidence_score);
    if (withAnalysis.length === 0) return 0;
    return Math.round(withAnalysis.reduce((acc, i) => acc + (i.analysis?.confidence_score || 0), 0) / withAnalysis.length);
  }, [incidents]);

  // Group by component
  const componentGroups = useMemo(() => incidents.reduce((acc, incident) => {
    const key = incident.component || "unknown";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(incident);
    return acc;
  }, {} as Record<string, Incident[]>), [incidents]);

  // Group by service
  const serviceGroups = useMemo(() => incidents.reduce((acc, incident) => {
    const key = incident.service || "unknown";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(incident);
    return acc;
  }, {} as Record<string, Incident[]>), [incidents]);

  // Group by source
  const sourceGroups = useMemo(() => incidents.reduce((acc, incident) => {
    const key = incident.source || "unknown";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(incident);
    return acc;
  }, {} as Record<string, Incident[]>), [incidents]);
  const renderIncidentCard = (incident: Incident) => {
    const config = severityConfig[incident.severity] || severityConfig.P2;
    const SeverityIcon = config.icon;
    const isExpanded = expandedIncidents.has(incident.id);
    const analysis = incident.analysis;
    return <Collapsible key={incident.id} open={isExpanded} onOpenChange={() => toggleExpanded(incident.id)}>
        <div className={cn("rounded-lg border transition-all", config.bg, config.border, incident.severity === "P0" && "glow-critical")}>
          <CollapsibleTrigger className="w-full">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn("p-2 rounded-lg mt-0.5", config.bg)}>
                    <SeverityIcon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">{incident.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {incident.severity}
                      </Badge>
                      <Badge className={cn("text-xs", statusConfig[incident.status]?.bg, statusConfig[incident.status]?.color)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Server className="h-3 w-3" />
                        {incident.service}
                      </span>
                      {incident.component && <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {incident.component}
                        </span>}
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {incident.alert_count} alerts
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {analysis && <div className="text-right">
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className={cn("font-bold", config.color)}>
                        {analysis.confidence_score}%
                      </p>
                    </div>}
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 pb-5 pt-0 border-t border-border/50 animate-fade-in">
              {analysis ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                  {/* Root Cause Card */}
                  <div className="group rounded-xl border border-status-critical/20 bg-gradient-to-br from-status-critical/5 to-transparent p-4 transition-all hover:border-status-critical/40 hover:shadow-lg hover:shadow-status-critical/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-critical/10 ring-2 ring-status-critical/20">
                        <Target className="h-5 w-5 text-status-critical" />
                      </div>
                      <h4 className="font-semibold text-status-critical">Root Cause</h4>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {analysis.root_cause}
                    </p>
                  </div>

                  {/* Causal Chain Card */}
                  <div className="group rounded-xl border border-status-warning/20 bg-gradient-to-br from-status-warning/5 to-transparent p-4 transition-all hover:border-status-warning/40 hover:shadow-lg hover:shadow-status-warning/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-warning/10 ring-2 ring-status-warning/20">
                        <Activity className="h-5 w-5 text-status-warning" />
                      </div>
                      <h4 className="font-semibold text-status-warning">Causal Chain</h4>
                    </div>
                    <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
                      {analysis.causal_chain.split('\n').map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {line.match(/^\d+\./) ? (
                            <>
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-warning/20 text-xs font-medium text-status-warning flex-shrink-0 mt-0.5">
                                {line.match(/^\d+/)?.[0]}
                              </span>
                              <span>{line.replace(/^\d+\.\s*/, '')}</span>
                            </>
                          ) : (
                            <span>{line}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Predicted Failures Card */}
                  <div className="group rounded-xl border border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent p-4 transition-all hover:border-destructive/40 hover:shadow-lg hover:shadow-destructive/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 ring-2 ring-destructive/20">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <h4 className="font-semibold text-destructive">Predicted Failures</h4>
                    </div>
                    <ul className="space-y-2">
                      {analysis.predicted_failures.map((failure, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive flex-shrink-0 mt-0.5">
                            !
                          </span>
                          <span className="leading-relaxed">{failure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Remediation Steps Card */}
                  <div className="group rounded-xl border border-status-success/20 bg-gradient-to-br from-status-success/5 to-transparent p-4 transition-all hover:border-status-success/40 hover:shadow-lg hover:shadow-status-success/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-success/10 ring-2 ring-status-success/20">
                        <CheckCircle2 className="h-5 w-5 text-status-success" />
                      </div>
                      <h4 className="font-semibold text-status-success">Remediation Steps</h4>
                    </div>
                    <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
                      {analysis.remediation_steps.split('\n').map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {line.match(/^\d+\./) ? (
                            <>
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-success/20 text-xs font-medium text-status-success flex-shrink-0 mt-0.5">
                                {line.match(/^\d+/)?.[0]}
                              </span>
                              <span>{renderWithBold(line.replace(/^\d+\.\s*/, ''))}</span>
                            </>
                          ) : (
                            <span>{renderWithBold(line)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">
                  No analysis available for this incident.
                </p>
              )}

              {/* Raw Alert Data */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Raw Alert Data</h4>
                </div>
                <div className="bg-muted/40 backdrop-blur-sm border border-border/50 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px]">Alert</span>
                      <p className="text-foreground/90 truncate">{incident.raw_data.alertName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px]">Application</span>
                      <p className="text-foreground/90 truncate">{incident.raw_data.applicationName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px]">Event ID</span>
                      <p className="text-foreground/90 truncate">{incident.raw_data.eventId}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px]">Source</span>
                      <p className="text-foreground/90 truncate">{incident.source}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>;
  };
  return <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Tech Breakdown Insights</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered incident analysis and root cause detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={v => setViewMode(v as "tech" | "non-tech")}>
            <TabsList>
              <TabsTrigger value="non-tech" className="gap-2">
                <Users className="h-4 w-4" />
                Status Overview
              </TabsTrigger>
              <TabsTrigger value="tech" className="gap-2">
                <Server className="h-4 w-4" />
                Technical
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button onClick={loadData} disabled={isRefreshing} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50">
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {viewMode === "non-tech" ? <NonTechCrisisView incidents={incidents} /> : <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="shadow-md border-l-4 border-l-status-critical">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-status-critical/10">
                <XCircle className="h-6 w-6 text-status-critical" />
              </div>
              <div>
                <p className="text-3xl font-bold font-heading text-status-critical">{p0Count}</p>
                <p className="text-sm text-muted-foreground">P0 Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-l-4 border-l-status-warning">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-status-warning/10">
                <AlertTriangle className="h-6 w-6 text-status-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold font-heading text-status-warning">{p1Count}</p>
                <p className="text-sm text-muted-foreground">P1 High</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{p2Count}</p>
                <p className="text-sm text-muted-foreground">P2 Medium</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <Zap className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{totalAlerts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-status-success/10">
                <Target className="h-6 w-6 text-status-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{avgConfidence}%</p>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* By Service */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              By Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(serviceGroups).sort((a, b) => b[1].length - a[1].length).slice(0, 5).map(([service, items]) => {
              const hasP0 = items.some(i => i.severity === "P0");
              return <div key={service} className="flex items-center justify-between">
                    <span className={cn("text-sm truncate", hasP0 && "text-status-critical font-medium")}>
                      {service}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {items.length}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {items.reduce((acc, i) => acc + i.alert_count, 0)} alerts
                      </span>
                    </div>
                  </div>;
            })}
          </CardContent>
        </Card>

        {/* By Severity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              By Severity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { severity: "P0", count: p0Count, alerts: incidents.filter(i => i.severity === "P0").reduce((acc, i) => acc + i.alert_count, 0), color: "text-status-critical" },
              { severity: "P1", count: p1Count, alerts: incidents.filter(i => i.severity === "P1").reduce((acc, i) => acc + i.alert_count, 0), color: "text-status-warning" },
              { severity: "P2", count: p2Count, alerts: incidents.filter(i => i.severity === "P2").reduce((acc, i) => acc + i.alert_count, 0), color: "text-yellow-500" },
              { severity: "P3", count: incidents.filter(i => i.severity === "P3").length, alerts: incidents.filter(i => i.severity === "P3").reduce((acc, i) => acc + i.alert_count, 0), color: "text-status-success" },
            ].filter(item => item.count > 0).map(({ severity, count, alerts, color }) => (
              <div key={severity} className="flex items-center justify-between">
                <span className={cn("text-sm font-medium", color)}>
                  {severity} - {severityConfig[severity]?.label}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {alerts.toLocaleString()} alerts
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Source */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              By Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(sourceGroups).sort((a, b) => b[1].length - a[1].length).map(([source, items]) => {
              const hasP0 = items.some(i => i.severity === "P0");
              return <div key={source} className="flex items-center justify-between">
                    <span className={cn("text-sm truncate", hasP0 && "text-status-critical font-medium")}>
                      {source}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {items.length}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {items.reduce((acc, i) => acc + i.alert_count, 0)} alerts
                      </span>
                    </div>
                  </div>;
            })}
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-critical" />
            <CardTitle className="font-heading text-lg">Incidents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="gap-2">
                Active Issues
                <Badge variant="secondary" className="ml-1">{activeIncidents.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                All Issues
                <Badge variant="secondary" className="ml-1">{incidents.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {activeIncidents.map(renderIncidentCard)}

                {activeIncidents.length === 0 && <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-status-success" />
                    <p className="font-medium">All systems operational</p>
                    <p className="text-sm">No active incidents detected</p>
                  </div>}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-3 pr-2">
                {paginatedIncidents.map(renderIncidentCard)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={cn(currentPage === 1 && "pointer-events-none opacity-50")} />
                    </PaginationItem>
                    {Array.from({
                    length: Math.min(5, totalPages)
                  }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return <PaginationItem key={page}>
                          <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>;
                  })}
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={cn(currentPage === totalPages && "pointer-events-none opacity-50")} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
        </>}
    </div>;
}