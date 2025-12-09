import { useState } from "react";
import { Phone, Mail, Globe, MessageSquare, AlertTriangle, Clock, User, X } from "lucide-react";
import { FDTicket, FDDrilldownPath, getSourceName } from "@/types/fdTicket";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSentimentLabel } from "@/utils/fdTicketAnalytics";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface FDTicketListProps {
  tickets: FDTicket[];
  filter: FDDrilldownPath;
}

const sourceIcons: Record<number, any> = {
  1: Mail,
  2: Globe,
  3: Phone,
  7: MessageSquare,
  9: AlertTriangle,
  10: Mail,
};

const sourceColors: Record<number, string> = {
  1: "hsl(38, 92%, 50%)",
  2: "hsl(262, 83%, 58%)",
  3: "hsl(199, 89%, 48%)",
  7: "hsl(142, 69%, 45%)",
  9: "hsl(350, 89%, 60%)",
  10: "hsl(280, 65%, 60%)",
};

const severityColors = {
  high: "bg-status-critical/10 text-status-critical border-status-critical/20",
  medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
  low: "bg-status-success/10 text-status-success border-status-success/20",
};

export function FDTicketList({ tickets, filter }: FDTicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<FDTicket | null>(null);

  const filteredTickets = tickets.filter(ticket => {
    // Only filter if specific values are set (not just level)
    if (filter.sourceId !== undefined && filter.sourceId !== null && ticket.source !== filter.sourceId) return false;
    if (filter.category && ticket.category !== filter.category) return false;
    if (filter.subcategory && ticket.subcategory !== filter.subcategory) return false;
    return true;
  });

  const getFilterLabel = () => {
    if (filter.subcategory) return `${filter.subcategory}`;
    if (filter.category) return `${filter.category}`;
    if (filter.source) return `${filter.source}`;
    return "All Tickets";
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-heading font-semibold">Ticket Details</h3>
        <Badge variant="outline" className="text-xs">
          {filteredTickets.length} tickets
        </Badge>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3 flex-shrink-0">
        Showing: {getFilterLabel()}
      </p>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="space-y-3 pr-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tickets match the current filter
            </div>
          ) : (
            filteredTickets.slice(0, 50).map(ticket => {
              const Icon = sourceIcons[ticket.source] || MessageSquare;
              const sentiment = getSentimentLabel(ticket.sentiment_score);
              
              return (
                <div
                  key={ticket.id}
                  className={cn(
                    "relative pl-6 pb-3 border-l-2 last:border-l-transparent",
                    ticket.severity_level === "high" && "border-status-critical/40",
                    ticket.severity_level === "medium" && "border-status-warning/40",
                    ticket.severity_level === "low" && "border-border"
                  )}
                >
                  <div
                    className="absolute left-[-5px] top-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: sourceColors[ticket.source] || "hsl(var(--muted-foreground))" }}
                  />
                  
                  <div
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-3 rounded-lg border transition-colors cursor-pointer hover:shadow-md",
                      ticket.severity_level === "high" && "border-status-critical/30 bg-status-critical/5 hover:bg-status-critical/10",
                      ticket.severity_level === "medium" && "border-status-warning/30 bg-status-warning/5 hover:bg-status-warning/10",
                      ticket.severity_level === "low" && "border-border bg-muted/20 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: sourceColors[ticket.source] || "hsl(var(--muted-foreground))" }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {getSourceName(ticket.source)}
                        </span>
                        <Badge
                          variant={
                            ticket.status === "Open" ? "critical" :
                            ticket.status === "Pending" ? "warning" :
                            "secondary"
                          }
                          className="text-xs"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          ticket.ticket_type === "Complaint" ? "critical" :
                          ticket.ticket_type === "Request" ? "warning" :
                          "outline"
                        }
                        className="text-xs"
                      >
                        {ticket.ticket_type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium line-clamp-1 mb-1">{ticket.issue_summary}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ticket.root_cause_candidate}</p>
                    
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {ticket.category}
                      </Badge>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: sentiment.color }}
                      >
                        {sentiment.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredTickets.length > 50 && (
            <p className="text-center text-xs text-muted-foreground py-2">
              Showing 50 of {filteredTickets.length} tickets
            </p>
          )}
        </div>
      </div>

      {/* Ticket Detail Popup */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 pr-8 leading-relaxed">
                  <span className="break-all leading-7">{selectedTicket.subject || selectedTicket.Subject}</span>
                  <Badge variant="outline" className={cn("text-xs flex-shrink-0", severityColors[selectedTicket.severity_level])}>
                    {selectedTicket.severity_level}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 overflow-hidden">
                {/* Status & Type Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      selectedTicket.status === "Open" ? "critical" :
                      selectedTicket.status === "Pending" ? "warning" :
                      "secondary"
                    }
                  >
                    {selectedTicket.status}
                  </Badge>
                  <Badge variant="outline">{selectedTicket.ticket_type}</Badge>
                  <Badge variant="outline">{getSourceName(selectedTicket.source)}</Badge>
                  <span className="text-sm text-muted-foreground">#{selectedTicket.id}</span>
                </div>

                {/* Issue Summary */}
                <div className="overflow-hidden">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Issue Summary</h4>
                  <p className="text-sm break-words whitespace-pre-wrap">{selectedTicket.issue_summary}</p>
                </div>

                {/* Root Cause */}
                {selectedTicket.root_cause_candidate && (
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Root Cause</h4>
                    <p className="text-sm break-words whitespace-pre-wrap">{selectedTicket.root_cause_candidate}</p>
                  </div>
                )}

                {/* Category & Subcategory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                    <p className="text-sm">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Subcategory</h4>
                    <p className="text-sm">{selectedTicket.subcategory}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Response Time</p>
                      <p className="text-sm font-medium">{selectedTicket.response_time}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Conversations</p>
                      <p className="text-sm font-medium">{selectedTicket.conversation_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Customer Type</p>
                      <p className="text-sm font-medium capitalize">{selectedTicket.customer_type}</p>
                    </div>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sentiment:</span>
                    <div className="flex items-center gap-1">
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          selectedTicket.sentiment_score >= 0.6 ? "bg-status-success" :
                          selectedTicket.sentiment_score >= 0.4 ? "bg-status-warning" : "bg-status-critical"
                        )}
                      />
                      <span className="text-sm font-medium">{(selectedTicket.sentiment_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Created: {format(new Date(selectedTicket.created_at), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>

                {/* Tags */}
                {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTicket.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOB */}
                <div className="pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Line of Business: </span>
                  <span className="text-sm font-medium">{selectedTicket.lob}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
