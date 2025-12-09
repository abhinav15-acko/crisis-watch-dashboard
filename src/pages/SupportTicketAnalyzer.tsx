import { useState, useMemo } from "react";
import { fdTickets } from "@/data/brandCrisis";
import { FDTicket, FDDrilldownPath, LOBAnalytics, SOURCE_MAP, SourceBreakdown, CategoryBreakdown } from "@/types/fdTicket";
import { aggregateByLOB, filterTickets } from "@/utils/fdTicketAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FDPieChart } from "@/components/brand/FDPieChart";
import { FDTicketList } from "@/components/brand/FDTicketList";
import { LOBStatsCard } from "@/components/brand/LOBStatsCard";
import { TicketPopup } from "@/components/brand/TicketPopup";
const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};
const trendColors = {
  up: "text-status-critical",
  down: "text-status-success",
  stable: "text-muted-foreground"
};

// Helper to aggregate sources across all LOBs
const aggregateAllSources = (lobAnalytics: LOBAnalytics[]): SourceBreakdown[] => {
  const sourceMap = new Map<number, SourceBreakdown>();
  lobAnalytics.forEach(lob => {
    lob.sources.forEach(source => {
      const existing = sourceMap.get(source.sourceId);
      if (existing) {
        existing.count += source.count;
        // Merge categories
        source.categories.forEach(cat => {
          const existingCat = existing.categories.find(c => c.category === cat.category);
          if (existingCat) {
            existingCat.count += cat.count;
            // Merge subcategories
            cat.subcategories.forEach(sub => {
              const existingSub = existingCat.subcategories.find(s => s.subcategory === sub.subcategory);
              if (existingSub) {
                existingSub.count += sub.count;
              } else {
                existingCat.subcategories.push({
                  ...sub
                });
              }
            });
          } else {
            existing.categories.push({
              category: cat.category,
              count: cat.count,
              subcategories: cat.subcategories.map(s => ({
                ...s
              }))
            });
          }
        });
      } else {
        sourceMap.set(source.sourceId, {
          source: source.source,
          sourceId: source.sourceId,
          count: source.count,
          categories: source.categories.map(cat => ({
            category: cat.category,
            count: cat.count,
            subcategories: cat.subcategories.map(s => ({
              ...s
            }))
          }))
        });
      }
    });
  });
  return Array.from(sourceMap.values());
};
export default function SupportTicketAnalyzer() {
  const lobAnalytics = useMemo(() => aggregateByLOB(fdTickets.tickets as FDTicket[]), []);
  const [selectedLOB, setSelectedLOB] = useState("All");
  const [currentPath, setCurrentPath] = useState<FDDrilldownPath>({
    level: "category"
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTickets, setPopupTickets] = useState<FDTicket[]>([]);
  const [popupTitle, setPopupTitle] = useState("");

  // Aggregate analytics for "All" LOBs
  const allAnalytics: LOBAnalytics = useMemo(() => ({
    lob: "All",
    total: lobAnalytics.reduce((sum, l) => sum + l.total, 0),
    openCount: lobAnalytics.reduce((sum, l) => sum + l.openCount, 0),
    closedCount: lobAnalytics.reduce((sum, l) => sum + l.closedCount, 0),
    pendingCount: lobAnalytics.reduce((sum, l) => sum + l.pendingCount, 0),
    avgSentiment: lobAnalytics.reduce((sum, l) => sum + l.avgSentiment * l.total, 0) / lobAnalytics.reduce((sum, l) => sum + l.total, 0),
    avgResponseTime: lobAnalytics.reduce((sum, l) => sum + l.avgResponseTime * l.total, 0) / lobAnalytics.reduce((sum, l) => sum + l.total, 0),
    highSeverityCount: lobAnalytics.reduce((sum, l) => sum + l.highSeverityCount, 0),
    mediumSeverityCount: lobAnalytics.reduce((sum, l) => sum + l.mediumSeverityCount, 0),
    lowSeverityCount: lobAnalytics.reduce((sum, l) => sum + l.lowSeverityCount, 0),
    complaintCount: lobAnalytics.reduce((sum, l) => sum + l.complaintCount, 0),
    queryCount: lobAnalytics.reduce((sum, l) => sum + l.queryCount, 0),
    requestCount: lobAnalytics.reduce((sum, l) => sum + l.requestCount, 0),
    sources: aggregateAllSources(lobAnalytics),
    trend: "stable" as const
  }), [lobAnalytics]);
  const currentAnalytics = selectedLOB === "All" ? allAnalytics : lobAnalytics.find(l => l.lob === selectedLOB) || lobAnalytics[0];
  const lobTickets = useMemo(() => selectedLOB === "All" ? fdTickets.tickets as FDTicket[] : (fdTickets.tickets as FDTicket[]).filter(t => t.lob === selectedLOB), [selectedLOB]);
  const handleLOBChange = (lob: string) => {
    setSelectedLOB(lob);
    setCurrentPath({
      level: "category"
    });
  };
  const handleCountClick = (entry: any, level: number) => {
    let filtered: FDTicket[] = [];
    let title = "";
    if (level === 1) {
      // Category level (now level 1 after removing Source from chart)
      filtered = lobTickets.filter(t => t.category === entry.name);
      title = `${entry.name} Tickets`;
    } else if (level === 2) {
      // Subcategory level
      filtered = lobTickets.filter(t => t.subcategory === entry.name);
      title = `${entry.name} Tickets`;
    }
    setPopupTickets(filtered);
    setPopupTitle(title);
    setPopupOpen(true);
  };

  // Global summary stats
  const totalTickets = fdTickets.tickets.length;
  const totalOpen = lobAnalytics.reduce((sum, l) => sum + l.openCount, 0);
  const totalComplaints = lobAnalytics.reduce((sum, l) => sum + l.complaintCount, 0);
  const totalHighSeverity = lobAnalytics.reduce((sum, l) => sum + l.highSeverityCount, 0);
  const totalClosed = lobAnalytics.reduce((sum, l) => sum + l.closedCount, 0);
  const summaryStats = [{
    label: "Customer Voices",
    value: totalTickets,
    icon: MessageSquare,
    color: "text-primary"
  }, {
    label: "Awaiting Resolution",
    value: totalOpen,
    icon: AlertTriangle,
    color: "text-status-critical"
  }, {
    label: "Critical Issues",
    value: totalHighSeverity,
    icon: AlertTriangle,
    color: "text-status-critical"
  }, {
    label: "Resolved",
    value: totalClosed,
    icon: CheckCircle2,
    color: "text-status-success"
  }];
  if (!currentAnalytics) {
    return <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No ticket data available</p>
      </div>;
  }
  return <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold">Customer Experience Insights</h1>
        <p className="text-muted-foreground mt-1">
          Uncover what customers truly experience • {totalTickets.toLocaleString()} conversations analysed across {lobAnalytics.length} business lines
        </p>
      </div>

      {/* Global Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map(stat => {
        const Icon = stat.icon;
        return <Card key={stat.label} className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* LOB Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
        {/* All option */}
        <button onClick={() => handleLOBChange("All")} className={cn("flex items-center gap-2 px-4 py-2.5 rounded whitespace-nowrap transition-all font-medium", selectedLOB === "All" ? "bg-primary text-primary-foreground shadow-md" : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted border border-border")}>
          <span>All</span>
          <Badge variant={selectedLOB === "All" ? "outline" : "secondary"} className={cn("text-xs ml-1", selectedLOB === "All" && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30")}>
            {allAnalytics.total}
          </Badge>
        </button>
        
        {lobAnalytics.map(lob => {
        const LobTrendIcon = trendIcons[lob.trend];
        const isActive = selectedLOB === lob.lob;
        return <button key={lob.lob} onClick={() => handleLOBChange(lob.lob)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded whitespace-nowrap transition-all font-medium", isActive ? "bg-primary text-primary-foreground shadow-md" : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted border border-border")}>
              <span>{lob.lob}</span>
              <LobTrendIcon className={cn("h-3.5 w-3.5", isActive ? "text-primary-foreground" : trendColors[lob.trend])} />
              <Badge variant={isActive ? "outline" : "secondary"} className={cn("text-xs ml-1", isActive && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30")}>
                {lob.total}
              </Badge>
            </button>;
      })}
      </div>

      {/* Selected LOB Stats Card */}
      <LOBStatsCard analytics={currentAnalytics} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Level Pie Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-heading">Theme Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <FDPieChart sources={currentAnalytics.sources} onPathChange={setCurrentPath} onCountClick={handleCountClick} />
          </CardContent>
        </Card>

        {/* Ticket List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading">Customer Conversations</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <FDTicketList tickets={lobTickets} filter={currentPath} />
          </CardContent>
        </Card>
      </div>

      {/* Ticket Popup */}
      <TicketPopup open={popupOpen} onOpenChange={setPopupOpen} tickets={popupTickets} title={popupTitle} />
    </div>;
}