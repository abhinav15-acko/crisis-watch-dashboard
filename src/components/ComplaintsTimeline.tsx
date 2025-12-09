import { Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Complaint, DrilldownPath } from "@/types/crisis";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComplaintsTimelineProps {
  complaints: Complaint[];
  filter: DrilldownPath;
}

const sourceIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
  other: MessageCircle,
};

const sourceColors: Record<string, string> = {
  twitter: "hsl(199, 89%, 48%)",
  linkedin: "hsl(210, 100%, 40%)",
  email: "hsl(38, 92%, 50%)",
  other: "hsl(262, 83%, 58%)",
};

export function ComplaintsTimeline({ complaints, filter }: ComplaintsTimelineProps) {
  // Filter complaints based on current drilldown path
  const filteredComplaints = complaints.filter((complaint) => {
    if (filter.source && complaint.source !== filter.source) {
      return false;
    }
    if (filter.category && complaint.issueCategory !== filter.category) {
      return false;
    }
    if (filter.subCategory && complaint.subCategory !== filter.subCategory) {
      return false;
    }
    return true;
  });

  const getFilterLabel = () => {
    if (filter.subCategory) return `Sub-category: ${filter.subCategory}`;
    if (filter.category) return `Category: ${filter.category}`;
    if (filter.source) return `Source: ${filter.source}`;
    return "All Complaints";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold">Complaints Timeline</h3>
        <Badge variant="outline" className="text-xs">
          {filteredComplaints.length} tickets
        </Badge>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        Showing: {getFilterLabel()}
      </p>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No complaints match the current filter
            </div>
          ) : (
            filteredComplaints.map((complaint) => {
              const Icon = sourceIcons[complaint.source];
              return (
                <div
                  key={complaint.id}
                  className={cn(
                    "relative pl-6 pb-3 border-l-2 last:border-l-transparent",
                    complaint.sentiment === "negative" && "border-status-critical/40",
                    complaint.sentiment === "positive" && "border-status-success/40",
                    complaint.sentiment === "neutral" && "border-border"
                  )}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-5px] top-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: sourceColors[complaint.source] }}
                  />
                  
                  <div
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      complaint.sentiment === "negative" &&
                        "border-status-critical/30 bg-status-critical/5",
                      complaint.sentiment === "positive" &&
                        "border-status-success/30 bg-status-success/5",
                      complaint.sentiment === "neutral" && "border-border bg-muted/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: sourceColors[complaint.source] }}
                        />
                        <span className="text-xs text-muted-foreground capitalize">
                          {complaint.source === "twitter" ? "Twitter/X" : complaint.source}
                        </span>
                      </div>
                      <Badge
                        variant={
                          complaint.sentiment === "negative"
                            ? "critical"
                            : complaint.sentiment === "positive"
                            ? "success"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {complaint.sentiment}
                      </Badge>
                    </div>
                    
                    <p className="text-sm line-clamp-2">{complaint.content}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.timestamp).toLocaleString()}
                      </p>
                      {complaint.issueCategory && (
                        <Badge variant="outline" className="text-xs">
                          {complaint.issueCategory.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
