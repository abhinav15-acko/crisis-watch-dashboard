import { useState } from "react";
import { FDTicket, getSourceName } from "@/types/fdTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  Globe,
  MessageSquare,
  AlertTriangle,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface TicketPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tickets: FDTicket[];
  title: string;
}

const sourceIcons: Record<string, any> = {
  Email: Mail,
  Phone: Phone,
  Portal: Globe,
  Chat: MessageSquare,
  "Feedback Widget": MessageSquare,
  "Outbound Email": Mail,
};

const severityColors = {
  high: "bg-status-critical/10 text-status-critical border-status-critical/20",
  medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
  low: "bg-status-success/10 text-status-success border-status-success/20",
};

const statusColors = {
  Open: "bg-status-critical/10 text-status-critical",
  Closed: "bg-status-success/10 text-status-success",
  Pending: "bg-status-warning/10 text-status-warning",
  Unknown: "bg-muted text-muted-foreground",
};

function TicketCard({ ticket, isExpanded, onToggle }: { 
  ticket: FDTicket; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sourceName = getSourceName(ticket.source);
  const SourceIcon = sourceIcons[sourceName] || MessageSquare;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-border",
        isExpanded && "ring-2 ring-primary/50"
      )}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SourceIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{ticket.subject || ticket.Subject}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className={cn("text-xs", statusColors[ticket.status])}>
              {ticket.status}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {/* Quick Info Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>#{ticket.id}</span>
          <span>•</span>
          <span>{sourceName}</span>
          <span>•</span>
          <span>{ticket.ticket_type}</span>
          <span>•</span>
          <Badge variant="outline" className={cn("text-xs", severityColors[ticket.severity_level])}>
            {ticket.severity_level}
          </Badge>
        </div>

        {/* Summary */}
        <p className={cn(
          "text-sm text-muted-foreground",
          !isExpanded && "line-clamp-2"
        )}>
          {ticket.issue_summary}
        </p>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in fade-in-0 slide-in-from-top-2">
            {/* Category & Subcategory */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{ticket.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Subcategory:</span>
                <p className="font-medium">{ticket.subcategory}</p>
              </div>
            </div>

            {/* Root Cause */}
            {ticket.root_cause_candidate && (
              <div className="text-sm">
                <span className="text-muted-foreground">Root Cause:</span>
                <p className="font-medium text-foreground">{ticket.root_cause_candidate}</p>
              </div>
            )}

            {/* Metrics Row */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Response:</span>
                <span className="font-medium">{ticket.response_time}h</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Conversations:</span>
                <span className="font-medium">{ticket.conversation_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium capitalize">{ticket.customer_type}</span>
              </div>
            </div>

            {/* Sentiment & Date */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sentiment:</span>
                <div className="flex items-center gap-1">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      ticket.sentiment_score >= 0.6 ? "bg-status-success" :
                      ticket.sentiment_score >= 0.4 ? "bg-status-warning" : "bg-status-critical"
                    )}
                  />
                  <span className="font-medium">{(ticket.sentiment_score * 100).toFixed(0)}%</span>
                </div>
              </div>
              <span className="text-muted-foreground">
                Created: {format(new Date(ticket.created_at), "MMM dd, yyyy HH:mm")}
              </span>
            </div>

            {/* Tags */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {ticket.tags.slice(0, 5).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {ticket.tags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{ticket.tags.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TicketPopup({ open, onOpenChange, tickets, title }: TicketPopupProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary">{tickets.length} tickets</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto -mx-6 px-6">
          <div className="space-y-3 pb-4 pr-2">
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tickets found
              </div>
            ) : (
              tickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isExpanded={expandedId === ticket.id}
                  onToggle={() => handleToggle(ticket.id)}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
