'use client';

import { useParams, useRouter } from 'next/navigation';
import { SERVER_APPS, MY_PROJECTS } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { StatusDot } from '@/components/status-dot';
import { useEffect, useState } from 'react';
import type { Status } from '@/components/status-dot';

const allServices = [...SERVER_APPS, ...MY_PROJECTS];

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const service = allServices.find(s => s.id === id);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (service) {
      fetch(`/api/status?url=${encodeURIComponent(service.url)}`)
        .then(res => res.json())
        .then(data => setStatus(data.status || 'offline'))
        .catch(() => setStatus('offline'));
    }
  }, [service]);

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Service not found.</p>
      </div>
    );
  }
  
  const Icon = service.icon;

  const handleOpenLink = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-32">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <Icon className="h-8 w-8" />
            {service.name}
          </CardTitle>
          <CardDescription>Detailed information for {service.name}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-muted-foreground">Status</span>
            <StatusDot status={status} />
          </div>
          {service.port && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Port</span>
              <span className="font-mono text-foreground">{service.port}</span>
            </div>
          )}
          {service.uptime && (
             <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-mono text-foreground">{service.uptime}</span>
            </div>
          )}
           <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground">URL</span>
              <a href={service.url} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline truncate max-w-[200px] sm:max-w-full">
                {service.url}
              </a>
            </div>
          <Button onClick={handleOpenLink} className="mt-4 w-full sm:w-auto">
            Open Service <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
