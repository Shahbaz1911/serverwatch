"use client"

import { useState, useEffect } from "react"
import { CircularProgressCard } from "./circular-progress"
import { Cpu, HardDrive, MemoryStick } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

interface SystemMetrics {
  cpu: number
  ram: number
  disk: number
}

export function SystemOverview() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/netdata")
      if (res.ok) {
        const data = await res.json()
        setMetrics(data)
      } else {
        console.error("Failed to fetch system metrics")
        setMetrics({ cpu: 0, ram: 0, disk: 0 })
      }
    } catch (error) {
      console.error("Error fetching system metrics:", error)
      setMetrics({ cpu: 0, ram: 0, disk: 0 })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">Could not load system metrics.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CircularProgressCard
        title="CPU Usage"
        description="Current processor load"
        value={metrics.cpu}
        icon={Cpu}
      />
      <CircularProgressCard
        title="RAM Usage"
        description="Memory in use"
        value={metrics.ram}
        icon={MemoryStick}
      />
      <CircularProgressCard
        title="Disk Usage"
        description="Root filesystem usage"
        value={metrics.disk}
        icon={HardDrive}
      />
    </div>
  )
}
