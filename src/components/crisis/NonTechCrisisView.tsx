import { useMemo } from "react";
import { Incident } from "@/types/crisis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  CreditCard,
  ShoppingCart,
  Bell,
  Database,
  Globe,
  Server,
  Activity,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface NonTechCrisisViewProps {
  incidents: Incident[];
}

// Map technical service names to user-friendly names and icons
const serviceDisplayConfig: Record<string, { label: string; icon: typeof Server; description: string }> = {
  "payment-api": {
    label: "Payments",
    icon: CreditCard,
    description: "Process payments and refunds",
  },
  "order-service": {
    label: "Orders",
    icon: ShoppingCart,
    description: "Place and track orders",
  },
  "user-service": {
    label: "User Accounts",
    icon: Users,
    description: "Login and account management",
  },
  "notification-service": {
    label: "Notifications",
    icon: Bell,
    description: "Email and push notifications",
  },
  "inventory-service": {
    label: "Inventory",
    icon: Database,
    description: "Stock and product availability",
  },
  "api-gateway": {
    label: "Website Access",
    icon: Globe,
    description: "General website connectivity",
  },
};


export default function NonTechCrisisView({ incidents }: NonTechCrisisViewProps) {
interface ServiceStatus {
    activeIncidents: Incident[];
    totalAlerts: number;
    highestSeverity: string;
  }

  // Group incidents by service
  const serviceStatus = useMemo(() => {
    const statusMap: Record<string, ServiceStatus> = {};

    incidents.forEach((incident) => {
      const service = incident.service || "unknown";
      if (!statusMap[service]) {
        statusMap[service] = { activeIncidents: [], totalAlerts: 0, highestSeverity: "P3" };
      }
      
      if (incident.status === "active") {
        statusMap[service].activeIncidents.push(incident);
        statusMap[service].totalAlerts += incident.alert_count;
        
        // Track highest severity
        const severityOrder = ["P0", "P1", "P2", "P3"];
        if (severityOrder.indexOf(incident.severity) < severityOrder.indexOf(statusMap[service].highestSeverity)) {
          statusMap[service].highestSeverity = incident.severity;
        }
      }
    });

    return statusMap;
  }, [incidents]);

  // Get all unique services
  const allServices = useMemo(() => {
    const services = new Set(incidents.map(i => i.service));
    // Add default services if not present
    Object.keys(serviceDisplayConfig).forEach(s => services.add(s));
    return Array.from(services);
  }, [incidents]);

  // Calculate overall system health
  const overallHealth = useMemo(() => {
    const totalServices = allServices.length;
    const affectedServices = Object.keys(serviceStatus).filter(
      s => serviceStatus[s].activeIncidents.length > 0
    ).length;
    
    const healthPercentage = Math.round(((totalServices - affectedServices) / totalServices) * 100);
    return healthPercentage;
  }, [allServices, serviceStatus]);

  const getStatusColor = (status: ServiceStatus | undefined) => {
    if (!status || status.activeIncidents.length === 0) {
      return { bg: "bg-status-success/10", border: "border-status-success/30", text: "text-status-success" };
    }
    if (status.highestSeverity === "P0") {
      return { bg: "bg-status-critical/10", border: "border-status-critical/30", text: "text-status-critical" };
    }
    if (status.highestSeverity === "P1") {
      return { bg: "bg-status-warning/10", border: "border-status-warning/30", text: "text-status-warning" };
    }
    return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-500" };
  };

  const getStatusIcon = (status: ServiceStatus | undefined) => {
    if (!status || status.activeIncidents.length === 0) {
      return CheckCircle2;
    }
    if (status.highestSeverity === "P0") {
      return XCircle;
    }
    return AlertTriangle;
  };

  const getStatusLabel = (status: ServiceStatus | undefined) => {
    if (!status || status.activeIncidents.length === 0) {
      return "Operational";
    }
    if (status.highestSeverity === "P0") {
      return "Major Outage";
    }
    if (status.highestSeverity === "P1") {
      return "Partial Outage";
    }
    return "Degraded";
  };

  // Derive chart data from actual incidents
  const chartData = useMemo(() => {
    // Alerts by service for bar chart
    const serviceAlerts = incidents.reduce((acc, i) => {
      const label = serviceDisplayConfig[i.service]?.label || i.service;
      acc[label] = (acc[label] || 0) + i.alert_count;
      return acc;
    }, {} as Record<string, number>);

    const alertsByService = Object.entries(serviceAlerts)
      .map(([name, alerts]) => ({ name, alerts }))
      .sort((a, b) => b.alerts - a.alerts);

    // Severity breakdown for pie chart
    const severityData = ["P0", "P1", "P2", "P3"].map(severity => ({
      name: severity,
      value: incidents.filter(i => i.severity === severity).length,
    })).filter(d => d.value > 0);

    // Incidents by status
    const statusData = [
      { name: "Active", value: incidents.filter(i => i.status === "active").length },
      { name: "Resolved", value: incidents.filter(i => i.status === "resolved").length },
    ].filter(d => d.value > 0);

    return { alertsByService, severityData, statusData };
  }, [incidents]);

  const SEVERITY_COLORS: Record<string, string> = {
    P0: "hsl(var(--status-critical))",
    P1: "hsl(var(--status-warning))",
    P2: "hsl(45 93% 47%)",
    P3: "hsl(var(--muted-foreground))",
  };

  const STATUS_COLORS = {
    Active: "hsl(var(--status-warning))",
    Resolved: "hsl(var(--status-success))",
  };

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card className={cn(
        "border-2",
        overallHealth >= 80 ? "border-status-success/30 bg-status-success/5" :
        overallHealth >= 50 ? "border-status-warning/30 bg-status-warning/5" :
        "border-status-critical/30 bg-status-critical/5"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-full",
                overallHealth >= 80 ? "bg-status-success/20" :
                overallHealth >= 50 ? "bg-status-warning/20" :
                "bg-status-critical/20"
              )}>
                {overallHealth >= 80 ? (
                  <CheckCircle2 className="h-8 w-8 text-status-success" />
                ) : overallHealth >= 50 ? (
                  <AlertTriangle className="h-8 w-8 text-status-warning" />
                ) : (
                  <XCircle className="h-8 w-8 text-status-critical" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">
                  {overallHealth >= 80 ? "All Systems Operational" :
                   overallHealth >= 50 ? "Some Services Affected" :
                   "Major Service Disruption"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {overallHealth >= 80 
                    ? "Everything is running smoothly"
                    : `${Object.keys(serviceStatus).filter(s => serviceStatus[s].activeIncidents.length > 0).length} service(s) currently experiencing issues`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold font-heading">{overallHealth}%</p>
              <p className="text-sm text-muted-foreground">System Health</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts by Service - Bar Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Alerts by Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.alertsByService} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
                    axisLine={false} 
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Alerts']}
                  />
                  <Bar dataKey="alerts" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Severity & Status Distribution - Pie Charts */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Incident Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex">
              {/* Severity Pie */}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground text-center mb-1">By Severity</p>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData.severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.severityData.map((entry) => (
                        <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 flex-wrap">
                  {chartData.severityData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[entry.name] }} />
                      <span className="text-xs text-muted-foreground">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Pie */}
              <div className="flex-1">
                <p className="text-xs text-muted-foreground text-center mb-1">By Status</p>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3">
                  {chartData.statusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }} />
                      <span className="text-xs text-muted-foreground">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allServices.map((service) => {
            const config = serviceDisplayConfig[service] || {
              label: service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              icon: Server,
              description: "Service component",
            };
            const status = serviceStatus[service];
            const colors = getStatusColor(status);
            const StatusIcon = getStatusIcon(status);
            const ServiceIcon = config.icon;
            const statusLabel = getStatusLabel(status);
            const hasIssues = status && status.activeIncidents.length > 0;

            return (
              <Card 
                key={service} 
                className={cn(
                  "transition-all hover:shadow-md border-2",
                  colors.border,
                  colors.bg
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", colors.bg)}>
                        <ServiceIcon className={cn("h-5 w-5", colors.text)} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{config.label}</h4>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <StatusIcon className={cn("h-6 w-6", colors.text)} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={cn(colors.bg, colors.text, "border-0")}>
                      {statusLabel}
                    </Badge>
                    {hasIssues && (
                      <span className="text-xs text-muted-foreground">
                        {status.activeIncidents.length} issue{status.activeIncidents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {hasIssues && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm font-medium mb-2">What's affected:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {status.activeIncidents.slice(0, 2).map((incident) => (
                          <li key={incident.id} className="flex items-start gap-2">
                            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", colors.text.replace('text-', 'bg-'))} />
                            <span className="line-clamp-1">
                              {incident.description.replace(/\[Run:.*?\]/g, '').trim()}
                            </span>
                          </li>
                        ))}
                        {status.activeIncidents.length > 2 && (
                          <li className="text-xs text-muted-foreground/70 pl-3.5">
                            +{status.activeIncidents.length - 2} more issues
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>


      {/* Recent Updates - Timeline View */}
      {Object.keys(serviceStatus).some(s => serviceStatus[s].activeIncidents.length > 0) && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              What's Happening
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {Object.entries(serviceStatus)
                  .filter(([_, status]) => status.activeIncidents.length > 0)
                  .flatMap(([service, status]) => 
                    status.activeIncidents
                      .filter(incident => incident.severity === "P0")
                      .map(incident => ({
                        service,
                        incident,
                      }))
                  )
                  .sort((a, b) => new Date(b.incident.created_at).getTime() - new Date(a.incident.created_at).getTime())
                  .slice(0, 5)
                  .map(({ service, incident }, index) => {
                    const config = serviceDisplayConfig[service] || { label: service, icon: Server };
                    const ServiceIcon = config.icon;
                    const severityColors = incident.severity === "P0" 
                      ? { bg: "bg-status-critical", ring: "ring-status-critical/20" }
                      : incident.severity === "P1"
                      ? { bg: "bg-status-warning", ring: "ring-status-warning/20" }
                      : { bg: "bg-yellow-500", ring: "ring-yellow-500/20" };
                    
                    return (
                      <div key={incident.id} className="relative flex gap-4 pl-2">
                        {/* Timeline dot */}
                        <div className={cn(
                          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4",
                          severityColors.bg,
                          severityColors.ring
                        )}>
                          <ServiceIcon className="h-5 w-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-1 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{config.label} Issue</p>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                incident.severity === "P0" && "border-status-critical/50 text-status-critical",
                                incident.severity === "P1" && "border-status-warning/50 text-status-warning",
                                incident.severity === "P2" && "border-yellow-500/50 text-yellow-500"
                              )}
                            >
                              {incident.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {incident.analysis?.root_cause 
                              ? incident.analysis.root_cause.split('.')[0] + '.'
                              : incident.description.replace(/\[Run:.*?\]/g, '').trim()
                            }
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(incident.created_at).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {incident.alert_count} alert{incident.alert_count > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
