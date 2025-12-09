import { FDTicket, LOBAnalytics, SourceBreakdown, CategoryBreakdown, getSourceName } from "@/types/fdTicket";

export function aggregateByLOB(tickets: FDTicket[]): LOBAnalytics[] {
  const lobMap = new Map<string, FDTicket[]>();
  
  tickets.forEach(ticket => {
    const lob = ticket.lob || "Unknown";
    if (!lobMap.has(lob)) {
      lobMap.set(lob, []);
    }
    lobMap.get(lob)!.push(ticket);
  });

  const analytics: LOBAnalytics[] = [];
  
  lobMap.forEach((lobTickets, lob) => {
    const sources = aggregateSources(lobTickets);
    const avgSentiment = lobTickets.reduce((sum, t) => sum + (t.sentiment_score || 0), 0) / lobTickets.length;
    const avgResponseTime = lobTickets.reduce((sum, t) => sum + (t.response_time || 0), 0) / lobTickets.length;
    
    analytics.push({
      lob,
      total: lobTickets.length,
      openCount: lobTickets.filter(t => t.status === "Open").length,
      closedCount: lobTickets.filter(t => t.status === "Closed").length,
      pendingCount: lobTickets.filter(t => t.status === "Pending").length,
      avgSentiment: parseFloat(avgSentiment.toFixed(2)),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
      highSeverityCount: lobTickets.filter(t => t.severity_level === "high").length,
      mediumSeverityCount: lobTickets.filter(t => t.severity_level === "medium").length,
      lowSeverityCount: lobTickets.filter(t => t.severity_level === "low").length,
      complaintCount: lobTickets.filter(t => t.ticket_type === "Complaint").length,
      queryCount: lobTickets.filter(t => t.ticket_type === "Query").length,
      requestCount: lobTickets.filter(t => t.ticket_type === "Request").length,
      sources,
      trend: calculateTrend(avgSentiment),
    });
  });

  return analytics.sort((a, b) => b.total - a.total);
}

function aggregateSources(tickets: FDTicket[]): SourceBreakdown[] {
  const sourceMap = new Map<number, FDTicket[]>();
  
  tickets.forEach(ticket => {
    const sourceId = ticket.source;
    if (!sourceMap.has(sourceId)) {
      sourceMap.set(sourceId, []);
    }
    sourceMap.get(sourceId)!.push(ticket);
  });

  const sources: SourceBreakdown[] = [];
  
  sourceMap.forEach((sourceTickets, sourceId) => {
    sources.push({
      source: getSourceName(sourceId),
      sourceId,
      count: sourceTickets.length,
      categories: aggregateCategories(sourceTickets),
    });
  });

  return sources.sort((a, b) => b.count - a.count);
}

function aggregateCategories(tickets: FDTicket[]): CategoryBreakdown[] {
  const categoryMap = new Map<string, FDTicket[]>();
  
  tickets.forEach(ticket => {
    const category = ticket.category || "Uncategorized";
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(ticket);
  });

  const categories: CategoryBreakdown[] = [];
  
  categoryMap.forEach((categoryTickets, category) => {
    const subcategoryMap = new Map<string, number>();
    categoryTickets.forEach(ticket => {
      const subcategory = ticket.subcategory || "Other";
      subcategoryMap.set(subcategory, (subcategoryMap.get(subcategory) || 0) + 1);
    });

    const subcategories = Array.from(subcategoryMap.entries())
      .map(([subcategory, count]) => ({ subcategory, count }))
      .sort((a, b) => b.count - a.count);

    categories.push({
      category,
      count: categoryTickets.length,
      subcategories,
    });
  });

  return categories.sort((a, b) => b.count - a.count);
}

function calculateTrend(avgSentiment: number): "up" | "down" | "stable" {
  if (avgSentiment < -0.2) return "up"; // Negative sentiment = crisis trending up
  if (avgSentiment > 0.2) return "down"; // Positive sentiment = crisis trending down
  return "stable";
}

export function filterTickets(
  tickets: FDTicket[],
  lob: string,
  path: { source?: string; sourceId?: number; category?: string; subcategory?: string }
): FDTicket[] {
  return tickets.filter(ticket => {
    if (ticket.lob !== lob) return false;
    if (path.sourceId !== undefined && ticket.source !== path.sourceId) return false;
    if (path.category && ticket.category !== path.category) return false;
    if (path.subcategory && ticket.subcategory !== path.subcategory) return false;
    return true;
  });
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "high": return "hsl(var(--status-critical))";
    case "medium": return "hsl(var(--status-warning))";
    case "low": return "hsl(var(--status-success))";
    default: return "hsl(var(--muted-foreground))";
  }
}

export function getSentimentLabel(score: number): { label: string; color: string } {
  if (score <= -0.5) return { label: "Very Negative", color: "hsl(var(--status-critical))" };
  if (score < 0) return { label: "Negative", color: "hsl(var(--status-warning))" };
  if (score === 0) return { label: "Neutral", color: "hsl(var(--muted-foreground))" };
  if (score <= 0.5) return { label: "Positive", color: "hsl(var(--status-success))" };
  return { label: "Very Positive", color: "hsl(var(--chart-success))" };
}
