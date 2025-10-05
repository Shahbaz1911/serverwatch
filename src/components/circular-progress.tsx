"use client"

import * as React from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import type { LucideIcon } from "lucide-react"

interface CircularProgressCardProps {
  title: string;
  description: string;
  value: number;
  icon: LucideIcon;
}

export function CircularProgressCard({ title, description, value, icon: Icon }: CircularProgressCardProps) {
  const chartData = [{ name: title, value: value, fill: "hsl(var(--primary))" }]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer
          config={{
            value: {
              label: title,
              color: "hsl(var(--primary))",
            },
          }}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="80%"
            outerRadius="100%"
            barSize={12}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              background={{ fill: 'hsl(var(--muted))' }}
              cornerRadius={10}
              isAnimationActive
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
             <g>
                <foreignObject width="100%" height="100%" style={{pointerEvents: 'none'}}>
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <Icon className="h-10 w-10 text-primary mb-2"/>
                        <span className="text-4xl font-bold text-foreground">
                            {value.toFixed(1)}%
                        </span>
                    </div>
                </foreignObject>
            </g>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
