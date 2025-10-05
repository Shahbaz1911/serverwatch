"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProactiveAlerts } from "@/ai/flows/generate-proactive-alerts";
import type { Status } from "./status-dot";
import { AlertTriangle, Bot, FileTerminal } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type AIAlertsProps = {
  statuses: Record<string, Status>;
  serverNames: Record<string, string>;
};

export function AIAlerts({ statuses, serverNames }: AIAlertsProps) {
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAlerts = async () => {
    setIsLoading(true);
    setAlerts([]);
    setError(null);

    const serverStatuses: Record<string, boolean> = {};
    Object.keys(statuses).forEach((id) => {
      const name = serverNames[id] || id;
      serverStatuses[name] = statuses[id] === 'online';
    });

    try {
      const result = await generateProactiveAlerts({ serverStatuses });
      setAlerts(result.alerts);
    } catch (e) {
      console.error("Failed to generate AI alerts:", e);
      setError("An error occurred while analyzing server statuses. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-primary/5 border-primary/20 animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-primary" />
            <div>
                <CardTitle className="font-headline text-xl text-primary">Proactive AI Analysis</CardTitle>
                <CardDescription className="mt-1">Get help diagnosing issues from our AI assistant.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">One or more services are offline. Our AI can analyze the situation and suggest potential causes or solutions.</p>
        <Button onClick={handleGenerateAlerts} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Generate AI Suggestions"}
          {!isLoading && <FileTerminal className="ml-2 h-4 w-4"/>}
        </Button>
        
        {isLoading && (
            <div className="mt-6 space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
            </div>
        )}
        
        {error && !isLoading && (
            <div className="mt-6 text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4"/>
                {error}
            </div>
        )}

        {alerts.length > 0 && !isLoading && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-foreground">AI Recommendations:</h3>
            <ul className="list-inside space-y-2">
              {alerts.map((alert, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-foreground/90">
                  <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
