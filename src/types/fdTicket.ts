export interface FDTicket {
  id: number;
  subject: string;
  status: "Open" | "Closed" | "Pending" | "Unknown";
  priority: number;
  ticket_type: "Query" | "Request" | "Complaint";
  lob: string;
  created_at: string;
  updated_at: string;
  requester_id: number;
  responder_id: number;
  source: number; // 1 = Email, 2 = Portal, 3 = Phone, etc.
  tags: string[];
  conversations: string[];
  conversation_count: number;
  sentiment_score: number;
  category: string;
  subcategory: string;
  severity_level: "low" | "medium" | "high";
  volume_weight: number;
  customer_type: "new" | "loyal" | "unknown";
  reach: string | null;
  attachment_present: boolean;
  geo_location: string | null;
  language: string;
  issue_summary: string;
  "tags / keywords": string[];
  engagement_metrics: any | null;
  response_time: number;
  entity_mentioned: string[];
  root_cause_candidate: string;
  Subject: string;
  Date: string;
  "Ticket type": string;
  Lob: string;
}

export interface SourceBreakdown {
  source: string;
  sourceId: number;
  count: number;
  categories: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  subcategories: SubcategoryBreakdown[];
}

export interface SubcategoryBreakdown {
  subcategory: string;
  count: number;
}

export interface LOBAnalytics {
  lob: string;
  total: number;
  openCount: number;
  closedCount: number;
  pendingCount: number;
  avgSentiment: number;
  avgResponseTime: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  complaintCount: number;
  queryCount: number;
  requestCount: number;
  sources: SourceBreakdown[];
  trend: "up" | "down" | "stable";
}

export interface FDDrilldownPath {
  level: "source" | "category" | "subcategory";
  source?: string;
  sourceId?: number;
  category?: string;
  subcategory?: string;
}

export const SOURCE_MAP: Record<number, string> = {
  1: "Email",
  2: "Portal",
  3: "Phone",
  7: "Chat",
  9: "Feedback Widget",
  10: "Outbound Email",
};

export const getSourceName = (sourceId: number): string => {
  return SOURCE_MAP[sourceId] || `Source ${sourceId}`;
};
