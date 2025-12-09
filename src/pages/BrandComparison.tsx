import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CompanyPerformance,
  BrandComparisonData,
} from "@/data/brandComparison";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsDown,
  MessageCircle,
  Heart,
  Repeat2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const API_URL = "http://192.168.235.182:5001/api/tweets/analyze";

const companyColors: Record<string, string> = {
  ACKO: "hsl(var(--chart-1))",
  Digit: "hsl(var(--chart-2))",
  HDFC: "hsl(var(--chart-3))",
  ICICI: "hsl(var(--chart-4))",
};

export default function BrandComparison() {
  const [data, setData] = useState<BrandComparisonData["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitorInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result: BrandComparisonData = await response.json();

      if (result?.success && result?.data) {
        setData(result.data);
      } else {
        throw new Error(result?.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch competitor insights"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitorInsights();
  }, []);

  const companies = data ? Object.keys(data.company_performance) : [];
  const company_performance = data?.company_performance || {};
  const comparative_analysis = data?.comparative_analysis || {
    best_customer_service: "",
    highest_claims_complaints: "",
    highest_negative_sentiment: "",
    summary: "",
  };
  const totalTweets = companies.reduce(
    (sum, c) => sum + (company_performance[c]?.total_tweets || 0),
    0
  );

  // Prepare data for category comparison bar chart
  const categoryData = useMemo(
    () =>
      [
        "App/Digital Experience",
        "Claims",
        "Customer Service",
        "Policy/Renewal",
      ].map((category) => {
        const entry: Record<string, string | number> = { category };
        companies.forEach((company) => {
          entry[company] =
            company_performance[company]?.category_breakdown[
              category as keyof CompanyPerformance["category_breakdown"]
            ] || 0;
        });
        return entry;
      }),
    [companies, company_performance]
  );

  // Prepare engagement data
  const engagementData = useMemo(
    () =>
      companies.map((company) => ({
        company,
        likes: company_performance[company]?.avg_engagement?.likes || 0,
        retweets: company_performance[company]?.avg_engagement?.retweets || 0,
      })),
    [companies, company_performance]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading competitor insights...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive font-medium">Error loading insights</p>
          <p className="text-muted-foreground text-sm mt-1">
            {error || "No data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Competitor Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          How do we compare? • {totalTweets.toLocaleString()} customer
          conversations analysed across {companies.length} insurers
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-status-error/30 bg-status-error/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-status-error" />
              Most Claims Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-status-error">
              {comparative_analysis.highest_claims_complaints}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Highest volume of claims-related issues
            </p>
          </CardContent>
        </Card>

        <Card className="border-status-warning/30 bg-status-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-status-warning" />
              Lowest Sentiment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-status-warning">
              {comparative_analysis.highest_negative_sentiment}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Most negative customer feedback
            </p>
          </CardContent>
        </Card>

        <Card className="border-status-success/30 bg-status-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-status-success" />
              Best Customer Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-status-success">
              {comparative_analysis.best_customer_service}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Most positive support feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Company Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {companies.map((company) => {
          const data = company_performance[company];
          const sentimentPercent = (
            (data.sentiment_counts.negative / data.total_tweets) *
            100
          ).toFixed(0);
          return (
            <Card key={company} className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  backgroundColor: companyColors[company],
                }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{company}</span>
                  <Badge
                    variant="outline"
                    className={
                      data.sentiment_score < -0.2
                        ? "text-status-error border-status-error"
                        : "text-status-warning border-status-warning"
                    }
                  >
                    {data.sentiment_score}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {data.total_tweets} customer voices analysed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{data.avg_engagement.likes} reach</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Repeat2 className="h-3.5 w-3.5" />
                    <span>{data.avg_engagement.retweets} amplified</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    {sentimentPercent}% frustrated
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Customer Complaints by Category
          </CardTitle>
          <CardDescription>
            Volume of negative feedback across key touchpoints. Higher bars
            indicate more customer issues in that area.
          </CardDescription>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="p-2 rounded bg-muted/50">
              <span className="font-medium text-foreground">App/Digital</span>
              <p>Mobile app, website, online processes</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <span className="font-medium text-foreground">Claims</span>
              <p>Claim filing, processing, payouts</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <span className="font-medium text-foreground">
                Customer Service
              </span>
              <p>Support calls, chat, agent interactions</p>
            </div>
            <div className="p-2 rounded bg-muted/50">
              <span className="font-medium text-foreground">
                Policy/Renewal
              </span>
              <p>Policy purchase, renewal, pricing</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="category"
                  className="text-xs fill-muted-foreground"
                  tick={{
                    fontSize: 11,
                  }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                {companies.map((company) => (
                  <Bar
                    key={company}
                    dataKey={company}
                    fill={companyColors[company]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voice Amplification</CardTitle>
          <CardDescription>
            How loudly are customers talking? Higher = more viral conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="company"
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="likes"
                  fill="hsl(var(--chart-1))"
                  name="Avg Likes"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="retweets"
                  fill="hsl(var(--chart-2))"
                  name="Avg Retweets"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-status-warning" />
            Competitor Strengths & Weaknesses
          </CardTitle>
          <CardDescription>
            What customers praise and criticise about each insurer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {companies.map((company) => {
            const keywords =
              company_performance[company].analysis_keywords || [];
            return (
              <div
                key={company}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: companyColors[company],
                      }}
                    />
                    <h4 className="font-semibold">{company}</h4>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {keywords.map((keyword, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className={
                          keyword.sentiment === "positive"
                            ? "border-green-500 text-green-600 bg-green-500/10"
                            : "border-red-500 text-red-600 bg-red-500/10"
                        }
                      >
                        {keyword.sentiment === "positive" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {keyword.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
