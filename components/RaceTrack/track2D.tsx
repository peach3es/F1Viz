"use client";

import { useEffect, useMemo, useState } from "react";

import { Slider } from "@/components/ui/slider";
import * as d3 from "d3";
import { motion } from "framer-motion";

import { drivers, teamColors } from "../../data/teamsData/teamData";

// Define the expected structure of your circuit data:
export interface CircuitData {
  track: { x: number; y: number }[];
  top3: { lap: number; placements: number[] }[];
}

interface Track2DProps {
  circuit: CircuitData;
}

export default function Track2D({ circuit }: Track2DProps) {
  // SVG dimensions and margin
  const width = 750;
  const height = 500;
  const margin = 30;
  const totalLaps = circuit.top3.length;

  // Continuous lap state: a number from 1.0 to totalLaps
  const [lap, setLap] = useState(1.0);

  // Auto-increment lap
  useEffect(() => {
    const interval = setInterval(() => {
      setLap((prev) => {
        const next = prev + 0.025;
        return next > totalLaps ? 1.0 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [totalLaps]);

  // Determine the current lap and get the corresponding top-3 data.
  const currentLap = Math.floor(lap);
  const lapData =
    circuit.top3.find((d) => d.lap === currentLap) || circuit.top3[0];
  const top3 = lapData.placements;

  // Lookup the first-place driver (leader)
  const leaderId = top3[0];
  const leader = drivers.find((d) => d.id === leaderId);
  const leaderColor = leader
    ? teamColors[leader.team as keyof typeof teamColors]
    : "#FFFFFF";
  const leaderName = leader ? leader.name : "";

  // D3 scales & path for the track
  const xExtent = d3.extent(circuit.track, (d) => d.x) as [number, number];
  const yExtent = d3.extent(circuit.track, (d) => d.y) as [number, number];
  const xRange = xExtent[1] - xExtent[0];
  const yRange = yExtent[1] - yExtent[0];
  const scaleFactor = Math.min(
    (width - 2 * margin) / xRange,
    (height - 2 * margin) / yRange
  );
  const scaledWidth = xRange * scaleFactor;
  const scaledHeight = yRange * scaleFactor;
  const xOffset = (width - scaledWidth) / 2;
  const yOffset = (height - scaledHeight) / 2;
  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([xOffset, xOffset + scaledWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([yOffset + scaledHeight, yOffset]);

  const lineGenerator = d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveCardinal);
  const pathData = useMemo(
    () => lineGenerator(circuit.track) || "",
    [circuit.track, lineGenerator]
  );

  // Compute cumulative lengths along the track.
  const cumulativeLengths = useMemo(() => {
    const cum: number[] = [0];
    for (let i = 1; i < circuit.track.length; i++) {
      const dx = circuit.track[i].x - circuit.track[i - 1].x;
      const dy = circuit.track[i].y - circuit.track[i - 1].y;
      cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    return cum;
  }, [circuit.track]);
  const totalLength = cumulativeLengths[cumulativeLengths.length - 1];

  const getPositionAtProgress = (progress: number) => {
    const targetLength = progress * totalLength;
    let idx = cumulativeLengths.findIndex((l) => l >= targetLength);
    if (idx === -1) idx = cumulativeLengths.length - 1;
    if (idx === 0) return circuit.track[0];
    const prev = circuit.track[idx - 1];
    const next = circuit.track[idx];
    const lPrev = cumulativeLengths[idx - 1];
    const lNext = cumulativeLengths[idx];
    const segFraction = (targetLength - lPrev) / (lNext - lPrev);
    return {
      x: prev.x + segFraction * (next.x - prev.x),
      y: prev.y + segFraction * (next.y - prev.y),
    };
  };

  const progress = lap % 1;
  const markerPos = getPositionAtProgress(progress);
  const markerX = xScale(markerPos.x);
  const markerY = yScale(markerPos.y);

  // Top-3 bubble diagram positions (static)
  const bubblePositions = [
    { cx: 50, cy: 75 },
    { cx: 150, cy: 75 },
    { cx: 250, cy: 75 },
  ];
  const top3Drivers = top3.map((id) => {
    const d = drivers.find((driver) => driver.id === id);
    return {
      name: d ? d.name : "",
      color: d ? teamColors[d.team] : "#FFFFFF",
    };
  });

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <p className="text-center text-2xl font-bold">Race Simulation</p>
      <div className="flex w-full flex-col items-center -space-y-2">
        {/* Top-3 Bubble Diagram */}
        <svg width={750} height={120} className="rounded bg-gray-900 shadow">
          {top3Drivers.map((driver, index) => (
            <g key={index}>
              <circle
                cx={bubblePositions[index].cx}
                cy={bubblePositions[index].cy - 10}
                r={17}
                fill={driver.color}
                stroke="black"
                strokeWidth={2}
              />
              <text
                x={bubblePositions[index].cx}
                y={bubblePositions[index].cy - 40}
                fill="white"
                fontSize="16px"
                fontWeight="bold"
                textAnchor="middle"
              >
                {driver.name}
              </text>
              <text
                x={bubblePositions[index].cx}
                y={bubblePositions[index].cy + 30}
                fill="white"
                fontSize="14px"
                fontWeight="bold"
                textAnchor="middle"
              >
                {index + 1}
              </text>
            </g>
          ))}
        </svg>
        {/* Track Visualization */}
        <svg
          width={width}
          height={height}
          className="rounded bg-gray-900 shadow"
        >
          <path d={pathData} fill="none" stroke="#DC0000" strokeWidth={10} />
          {/* Starting Point Marker */}
          <motion.circle
            cx={xScale(circuit.track[0].x)}
            cy={yScale(circuit.track[0].y)}
            r={8}
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Leader Marker */}
          <motion.circle
            animate={{ cx: markerX, cy: markerY }}
            transition={{ duration: 0.05, ease: "linear" }}
            r={10}
            fill={leaderColor}
          />
          <text
            x={markerX + 15}
            y={markerY - 15}
            fill={leaderColor}
            fontSize="16px"
            fontWeight="bold"
          >
            {leaderName}
          </text>
        </svg>
      </div>
      {/* Slider for lap progress */}
      <div className="w-full max-w-lg">
        <Slider
          value={[lap]}
          min={1}
          max={totalLaps}
          step={0.01}
          onValueChange={(value) => setLap(value[0])}
        />
        <p className="mt-2 text-center text-lg font-semibold text-black">
          Lap {lap.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
