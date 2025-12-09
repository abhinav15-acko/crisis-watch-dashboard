import { LOBAnalytics } from "@/types/fdTicket";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface LOBStatsCardProps {
  analytics: LOBAnalytics;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: "text-status-critical",
  down: "text-status-success",
  stable: "text-muted-foreground",
};

export function LOBStatsCard({ analytics }: LOBStatsCardProps) {
  const TrendIcon = trendIcons[analytics.trend];
  
  const stats = [
    {
      label: "Unresolved",
      value: analytics.openCount,
      icon: AlertTriangle,
      color: "text-status-critical",
      bgColor: "bg-status-critical/10",
    },
    {
      label: "In Progress",
      value: analytics.pendingCount,
      icon: Clock,
      color: "text-status-warning",
      bgColor: "bg-status-warning/10",
    },
    {
      label: "Resolved",
      value: analytics.closedCount,
      icon: CheckCircle2,
      color: "text-status-success",
      bgColor: "bg-status-success/10",
    },
    {
      label: "Frustrations",
      value: analytics.complaintCount,
      icon: MessageSquare,
      color: "text-status-critical",
      bgColor: "bg-status-critical/10",
    },
  ];

  const severityStats = [
    { label: "Critical", value: analytics.highSeverityCount, color: "bg-status-critical" },
    { label: "Moderate", value: analytics.mediumSeverityCount, color: "bg-status-warning" },
    { label: "Minor", value: analytics.lowSeverityCount, color: "bg-status-success" },
  ];

  const sentimentLabel = analytics.avgSentiment < -0.2 
    ? { text: "Negative", color: "text-status-critical" }
    : analytics.avgSentiment > 0.2 
    ? { text: "Positive", color: "text-status-success" }
    : { text: "Neutral", color: "text-muted-foreground" };

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4">
        {/* Header with trend */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-lg font-semibold">{analytics.lob === "All" ? "All Business Lines" : analytics.lob}</h3>
            <p className="text-sm text-muted-foreground">{analytics.total.toLocaleString()} customer interactions</p>
          </div>
          {analytics.lob !== "All" && (
            <div className={cn("flex items-center gap-1", trendColors[analytics.trend])}>
              <TrendIcon className="h-5 w-5" />
              <span className="text-sm font-medium capitalize">{analytics.trend === "up" ? "Rising" : analytics.trend === "down" ? "Declining" : "Steady"}</span>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={cn("p-2 rounded-lg text-center", stat.bgColor)}>
                <Icon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Severity Distribution */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Issue Intensity</p>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted">
            {severityStats.map((sev, idx) => (
              <div
                key={sev.label}
                className={cn("h-full", sev.color)}
                style={{ width: `${(sev.value / analytics.total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            {severityStats.map(sev => (
              <span key={sev.label}>{sev.label}: {sev.value}</span>
            ))}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Customer Sentiment: </span>
            <span className={cn("font-medium", sentimentLabel.color)}>
              {sentimentLabel.text}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Avg Response: </span>
            <span className="font-medium">{analytics.avgResponseTime}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
