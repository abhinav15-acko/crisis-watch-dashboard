export type Severity = "critical" | "high" | "medium" | "low";

export interface Notification {
  id: string;
  content: string;
  severity: Severity;
  pincodes: string[];
  usersCount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface LOBStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  lastIncident: string | null;
  services: ServiceStatus[];
}

export interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseTime: number;
}

export type IssueCategory = 
  | "app_crash" 
  | "slow_performance" 
  | "payment_failed" 
  | "login_issues" 
  | "ui_bugs" 
  | "data_mismatch"
  | "timeout"
  | "other";

export type SubCategory = string;

export interface SubCategoryItem {
  subCategory: SubCategory;
  count: number;
  label: string;
}

export interface IssueClassification {
  category: IssueCategory;
  count: number;
  label: string;
  subCategories: SubCategoryItem[];
}

export interface ComplaintSource {
  source: "twitter" | "linkedin" | "email" | "other";
  count: number;
  issues: IssueClassification[];
}

export interface LOBComplaints {
  lob: string;
  total: number;
  sources: ComplaintSource[];
  trend: "up" | "down" | "stable";
  complaints: Complaint[];
}

export interface Complaint {
  id: string;
  source: "twitter" | "linkedin" | "email" | "other";
  content: string;
  sentiment: "negative" | "neutral" | "positive";
  timestamp: string;
  lob: string;
  issueCategory?: IssueCategory;
  subCategory?: SubCategory;
}

export interface DrilldownPath {
  level: "source" | "category" | "subcategory";
  source?: string;
  category?: string;
  subCategory?: string;
}

export interface IncidentAnalysisMetadata {
  incident_id: string;
  source: string;
  incident_data?: Record<string, unknown>;
  request_prompt?: string;
}

export interface IncidentAnalysis {
  analysis_metadata?: IncidentAnalysisMetadata;
  causal_chain: string;
  confidence_score: number;
  ops_intimation?: string | null;
  predicted_failures: string[];
  remediation_steps: string;
  root_cause: string;
}

export interface IncidentRawData {
  alertName?: string;
  applicationName?: string;
  eventId?: string;
  message?: string;
  severity?: string;
  title?: string;
  property?: string;
  metadata?: Record<string, unknown>;
}

export interface Incident {
  id: string;
  alert_count: number;
  analysis: IncidentAnalysis | null;
  component: string;
  created_at: string;
  description: string;
  incident_key: string;
  raw_data: IncidentRawData;
  resolved_at: string | null;
  service: string;
  severity: string;
  source: string;
  status: string;
  title: string;
  updated_at: string;
}

export interface IncidentStats {
  queue_size: number;
  total_deduplicated: number;
  total_processed: number;
}

export interface IncidentDataResponse {
  data: {
    count: number;
    incidents: Incident[];
    stats?: IncidentStats;
  };
  success: boolean;
}
