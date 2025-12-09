import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChevronRight, Home } from "lucide-react";
import { ComplaintSource, DrilldownPath } from "@/types/crisis";
import { cn } from "@/lib/utils";

interface MultiLevelPieChartProps {
  sources: ComplaintSource[];
  onPathChange?: (path: DrilldownPath) => void;
}

const sourceColors: Record<string, string> = {
  twitter: "hsl(199, 89%, 48%)",
  linkedin: "hsl(210, 100%, 40%)",
  email: "hsl(38, 92%, 50%)",
  other: "hsl(262, 83%, 58%)",
};

const categoryColors: Record<string, string> = {
  app_crash: "hsl(0, 72%, 51%)",
  slow_performance: "hsl(38, 92%, 50%)",
  payment_failed: "hsl(350, 89%, 60%)",
  login_issues: "hsl(280, 65%, 60%)",
  ui_bugs: "hsl(200, 80%, 50%)",
  data_mismatch: "hsl(160, 60%, 45%)",
  timeout: "hsl(30, 80%, 55%)",
  other: "hsl(220, 15%, 50%)",
};

const subCategoryColors = [
  "hsl(173, 58%, 39%)",
  "hsl(197, 71%, 43%)",
  "hsl(292, 45%, 51%)",
  "hsl(142, 69%, 45%)",
  "hsl(45, 93%, 47%)",
  "hsl(12, 76%, 51%)",
  "hsl(221, 83%, 53%)",
  "hsl(262, 52%, 47%)",
];

const sourceLabels: Record<string, string> = {
  twitter: "Twitter/X",
  linkedin: "LinkedIn",
  email: "Email",
  other: "Other",
};

export function MultiLevelPieChart({ sources, onPathChange }: MultiLevelPieChartProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Determine current level and data
  const getCurrentData = () => {
    if (selectedSource && selectedCategory) {
      // Level 3: Sub-categories
      const source = sources.find((s) => s.source === selectedSource);
      const category = source?.issues.find((i) => i.category === selectedCategory);
      return category?.subCategories.map((sub, idx) => ({
        name: sub.label,
        value: sub.count,
        key: sub.subCategory,
        color: subCategoryColors[idx % subCategoryColors.length],
      })) || [];
    } else if (selectedSource) {
      // Level 2: Categories
      const source = sources.find((s) => s.source === selectedSource);
      return source?.issues.map((issue) => ({
        name: issue.label,
        value: issue.count,
        key: issue.category,
        color: categoryColors[issue.category] || categoryColors.other,
      })) || [];
    } else {
      // Level 1: Sources
      return sources.map((s) => ({
        name: sourceLabels[s.source],
        value: s.count,
        key: s.source,
        color: sourceColors[s.source],
      }));
    }
  };

  const currentData = getCurrentData();
  const currentLevel = selectedCategory ? 3 : selectedSource ? 2 : 1;

  const handleSliceClick = (entry: any) => {
    if (currentLevel === 1) {
      setSelectedSource(entry.key);
      onPathChange?.({ level: "category", source: entry.key });
    } else if (currentLevel === 2) {
      setSelectedCategory(entry.key);
      onPathChange?.({ level: "subcategory", source: selectedSource!, category: entry.key });
    }
    setHoveredIndex(null);
  };

  const navigateToLevel = (level: number) => {
    if (level === 1) {
      setSelectedSource(null);
      setSelectedCategory(null);
      onPathChange?.({ level: "source" });
    } else if (level === 2 && selectedSource) {
      setSelectedCategory(null);
      onPathChange?.({ level: "category", source: selectedSource });
    }
    setHoveredIndex(null);
  };

  const getBreadcrumbs = () => {
    const crumbs: { label: string; level: number }[] = [
      { label: "Sources", level: 1 }
    ];
    if (selectedSource) {
      crumbs.push({ label: sourceLabels[selectedSource], level: 2 });
    }
    if (selectedCategory) {
      const source = sources.find((s) => s.source === selectedSource);
      const category = source?.issues.find((i) => i.category === selectedCategory);
      crumbs.push({ label: category?.label || selectedCategory, level: 3 });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.level} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <button
              onClick={() => navigateToLevel(crumb.level)}
              className={cn(
                "px-2 py-1 rounded-md transition-colors",
                idx === breadcrumbs.length - 1
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {idx === 0 && <Home className="h-3.5 w-3.5 inline mr-1" />}
              {crumb.label}
            </button>
          </div>
        ))}
      </div>

      {/* Chart Title */}
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          {currentLevel === 1 && "Click a slice to view categories"}
          {currentLevel === 2 && "Click a slice to view sub-categories"}
          {currentLevel === 3 && "Sub-category breakdown"}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(_, index) => handleSliceClick(currentData[index])}
              style={{ cursor: currentLevel < 3 ? "pointer" : "default" }}
            >
              {currentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={hoveredIndex === index ? "hsl(var(--foreground))" : "transparent"}
                  strokeWidth={hoveredIndex === index ? 2 : 0}
                  style={{
                    filter: hoveredIndex === index ? "brightness(1.1)" : "none",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`${value} complaints`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs pt-2">
        {currentData.map((entry, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all",
              hoveredIndex === index ? "bg-muted" : "hover:bg-muted/50",
              currentLevel < 3 && "cursor-pointer"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSliceClick(entry)}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="text-foreground font-medium">({entry.value})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
