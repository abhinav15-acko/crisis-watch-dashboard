import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Ticket, 
  BarChart3, 
  CheckSquare,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    title: "Tech Crisis",
    description: "Monitor system incidents, analyze root causes, and track service health in real-time.",
    path: "/tech",
    icon: AlertTriangle,
    color: "text-status-critical",
    bgColor: "bg-status-critical/10",
    borderColor: "border-status-critical/30",
  },
  {
    title: "Hassle Lists",
    description: "Analyze customer support tickets by LOB, sentiment, and category breakdowns.",
    path: "/support-tickets",
    icon: Ticket,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    title: "Competitor Insights",
    description: "Compare brand performance, customer sentiment, and market positioning across insurers.",
    path: "/brand-comparison",
    icon: BarChart3,
    color: "text-status-warning",
    bgColor: "bg-status-warning/10",
    borderColor: "border-status-warning/30",
  },
];

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
          Command Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Your unified dashboard for monitoring incidents, analyzing support tickets, and tracking competitor insights.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link key={route.path} to={route.path}>
              <Card 
                className={cn(
                  "h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2",
                  route.borderColor,
                  "hover:border-opacity-60"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-lg", route.bgColor)}>
                      <Icon className={cn("h-6 w-6", route.color)} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-xl mt-4">{route.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {route.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
