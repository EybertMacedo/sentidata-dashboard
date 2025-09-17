import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { DashboardData } from "@/hooks/use-dashboard-data";
import { SentimentDonutChart } from "./SentimentDonutChart";
import { SentimentDensityChart } from "./SentimentDensityChart";

interface SentimentDistributionPanelProps {
  data: DashboardData;
}

export function SentimentDistributionPanel({ data }: SentimentDistributionPanelProps) {
  const [showDensity, setShowDensity] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toggle Control */}
      <div className="flex items-center justify-end px-2 py-1 mb-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="sentiment-toggle"
            checked={showDensity}
            onCheckedChange={setShowDensity}
          />
          <Label htmlFor="sentiment-toggle" className="text-xs text-muted-foreground">
            {showDensity ? "Densidad (c_intensidad)" : "Clasificación"}
          </Label>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 min-h-0">
        {showDensity ? (
          <SentimentDensityChart data={data} />
        ) : (
          <SentimentDonutChart data={data} />
        )}
      </div>
    </div>
  );
}


