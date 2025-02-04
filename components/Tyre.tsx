import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// Import Recharts primitives.
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface TyreChartProps {
  data: any[];
  segmentColors: Record<string, string[]>;
  totalLaps: number;
}

// This is your tire compound colors object.
const compoundColors: Record<string, string> = {
  SOFT: "#ff2d55",
  MEDIUM: "#ffcc00",
  HARD: "#ffffff",
  INTERMEDIATE: "#4cd964",
  WET: "#0091ea",
};

// Create a custom legend component for tire compounds.
function TireCompoundLegend() {
  return (
    <div className="ml-14 mt-4 flex justify-center gap-4">
      {Object.entries(compoundColors).map(([compound, color]) => (
        <div key={compound} className="flex items-center">
          <div
            className="mr-2 h-4 w-4 rounded-sm"
            style={{
              backgroundColor: color,
              border: "1px solid #a3a8b6",
            }}
          />
          <span className="text-sm">{compound}</span>
        </div>
      ))}
    </div>
  );
}

function TyreChart({ data, segmentColors, totalLaps }: TyreChartProps) {
  // Define chart configuration for shadcn styling (if needed)
  const chartConfig = {
    stints: {
      color: "#000",
      label: "Stint",
    },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="flex w-full items-center justify-center"
    >
      <ResponsiveContainer width="200%" height="140%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ right: 40, left: -20, top: 20 }}
        >
          <XAxis
            type="number"
            domain={[0, totalLaps]}
            tickLine={{ stroke: "#000" }}
            tickMargin={10}
          />
          <YAxis
            type="category"
            dataKey="driver"
            tickLine={false}
            width={80}
            tickMargin={10}
          />
          <CartesianGrid horizontal={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {/*
            Create one Bar per segment.
            Increase barSize for thicker bars.
            */}
          {Object.keys(segmentColors).map((segKey) => (
            <Bar
              key={segKey}
              dataKey={segKey}
              stackId="a"
              radius={5}
              barSize={20}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${segKey}-${index}`}
                  fill={segmentColors[segKey][index]}
                />
              ))}
            </Bar>
          ))}
          <ChartLegend content={<TireCompoundLegend />} className="w-full" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default TyreChart;
