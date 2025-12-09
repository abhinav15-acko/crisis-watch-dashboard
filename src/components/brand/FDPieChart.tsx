import { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChevronRight, Home } from "lucide-react";
import { SourceBreakdown, FDDrilldownPath, CategoryBreakdown } from "@/types/fdTicket";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChartDataEntry {
  name: string;
  value: number;
  key: string;
  color: string;
  sourceId?: number;
}

interface FDPieChartProps {
  sources: SourceBreakdown[];
  onPathChange?: (path: FDDrilldownPath) => void;
  onCountClick?: (entry: ChartDataEntry, level: number) => void;
}

const sourceColors: Record<string, string> = {
  "Email": "hsl(38, 92%, 50%)",
  "Phone": "hsl(199, 89%, 48%)",
  "Portal": "hsl(262, 83%, 58%)",
  "Chat": "hsl(142, 69%, 45%)",
  "Feedback Widget": "hsl(350, 89%, 60%)",
  "Outbound Email": "hsl(280, 65%, 60%)",
};

const categoryColors = [
  "hsl(0, 72%, 51%)",
  "hsl(38, 92%, 50%)",
  "hsl(350, 89%, 60%)",
  "hsl(280, 65%, 60%)",
  "hsl(200, 80%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
  "hsl(220, 15%, 50%)",
];

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

export function FDPieChart({ sources, onPathChange, onCountClick }: FDPieChartProps) {
  const [selectedSources, setSelectedSources] = useState<string[]>(sources.map(s => s.source));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Reset state when sources change (LOB changed)
  useEffect(() => {
    setSelectedSources(sources.map(s => s.source));
    setSelectedCategory(null);
    setHoveredIndex(null);
  }, [sources]);

  // Aggregate categories from selected sources
  const aggregatedCategories = useMemo(() => {
    const categoryMap = new Map<string, CategoryBreakdown>();
    
    sources
      .filter(s => selectedSources.includes(s.source))
      .forEach(source => {
        source.categories.forEach(cat => {
          const existing = categoryMap.get(cat.category);
          if (existing) {
            existing.count += cat.count;
            cat.subcategories.forEach(sub => {
              const existingSub = existing.subcategories.find(s => s.subcategory === sub.subcategory);
              if (existingSub) {
                existingSub.count += sub.count;
              } else {
                existing.subcategories.push({ ...sub });
              }
            });
          } else {
            categoryMap.set(cat.category, {
              category: cat.category,
              count: cat.count,
              subcategories: cat.subcategories.map(s => ({ ...s })),
            });
          }
        });
      });
    
    return Array.from(categoryMap.values());
  }, [sources, selectedSources]);

  const getCurrentData = (): ChartDataEntry[] => {
    if (selectedCategory) {
      const category = aggregatedCategories.find(c => c.category === selectedCategory);
      return category?.subcategories.map((sub, idx) => ({
        name: sub.subcategory,
        value: sub.count,
        key: sub.subcategory,
        color: subCategoryColors[idx % subCategoryColors.length],
      })) || [];
    } else {
      return aggregatedCategories.map((cat, idx) => ({
        name: cat.category,
        value: cat.count,
        key: cat.category,
        color: categoryColors[idx % categoryColors.length],
      }));
    }
  };

  const currentData = getCurrentData();
  const totalValue = currentData.reduce((sum, d) => sum + d.value, 0);
  const currentLevel = selectedCategory ? 2 : 1;

  const handleSourceToggle = (source: string) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(s => s !== source);
      }
      return [...prev, source];
    });
    // Reset category selection when sources change
    setSelectedCategory(null);
    onPathChange?.({ level: "category" });
  };

  const handleSliceClick = (entry: ChartDataEntry) => {
    if (currentLevel === 1) {
      setSelectedCategory(entry.key);
      onPathChange?.({ level: "subcategory", category: entry.key });
    } else if (currentLevel === 2) {
      onCountClick?.(entry, currentLevel);
    }
    setHoveredIndex(null);
  };

  const navigateToLevel = (level: number) => {
    if (level === 1) {
      setSelectedCategory(null);
      onPathChange?.({ level: "category" });
    }
    setHoveredIndex(null);
  };

  const getBreadcrumbs = () => {
    const crumbs: { label: string; level: number }[] = [
      { label: "Categories", level: 1 }
    ];
    if (selectedCategory) {
      crumbs.push({ label: selectedCategory, level: 2 });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-full flex flex-col">
      {/* Source Filters - Top */}
      <div className="pb-3 mb-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Sources</p>
        <div className="flex flex-wrap gap-3">
          {sources.map(source => (
            <div key={source.source} className="flex items-center gap-1.5">
              <Checkbox
                id={`source-${source.sourceId}`}
                checked={selectedSources.includes(source.source)}
                onCheckedChange={() => handleSourceToggle(source.source)}
                className="h-3.5 w-3.5"
              />
              <Label
                htmlFor={`source-${source.sourceId}`}
                className="text-xs cursor-pointer flex items-center gap-1"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: sourceColors[source.source] || "hsl(220, 15%, 50%)" }}
                />
                <span>{source.source}</span>
                <span className="text-muted-foreground">({source.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1 text-sm mb-2 flex-wrap">
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
        <div className="text-center mb-1">
          <p className="text-xs text-muted-foreground">
            {currentLevel === 1 && "Click a slice to view sub-categories"}
            {currentLevel === 2 && "Click a slice to view tickets"}
          </p>
        </div>

        {/* Pie Chart */}
        <div className="flex-1 min-h-[180px]">
          {currentData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(_, index) => handleSliceClick(currentData[index])}
                  style={{ cursor: "pointer" }}
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
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataEntry;
                      const percentage = totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(1) : 0;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-foreground">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.value.toLocaleString()} conversations ({percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No data for selected sources
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-1.5 text-xs pt-1 max-h-[80px] overflow-y-auto">
          {currentData.slice(0, 6).map((entry, index) => {
            const percentage = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer",
                  hoveredIndex === index ? "bg-muted" : "hover:bg-muted/50"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleSliceClick(entry)}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground truncate max-w-[70px]">{entry.name}</span>
                <span className="text-primary font-medium">{percentage}%</span>
                <button
                  className="text-muted-foreground hover:text-primary hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCountClick?.(entry, currentLevel);
                  }}
                >
                  ({entry.value.toLocaleString()})
                </button>
              </div>
            );
          })}
          {currentData.length > 6 && (
            <span className="text-muted-foreground text-xs">+{currentData.length - 6} more</span>
          )}
        </div>
      </div>
    </div>
  );
}