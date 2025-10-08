import type { LucideIcon } from "lucide-react";
import { Server, Cloud, LineChart, Zap, Globe, ShoppingCart, GalleryHorizontal, Code, KanbanSquare } from 'lucide-react';

export interface MonitoredService {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  color: string;
  port?: number;
  uptime?: string;
}

export const SERVER_APPS: MonitoredService[] = [
  { id: 'portainer', name: 'Portainer', url: 'https://portainor.shahbaz.online/', icon: Server, color: 'blue', port: 9443, uptime: '99.8%' },
  { id: 'netdata', name: 'Netdata', url: 'https://netdata.shahbaz.online/', icon: LineChart, color: 'green', port: 19999, uptime: '99.9%' },
  { id: 'n8n', name: 'n8n', url: 'https://n8n.shahbaz.online/', icon: Zap, color: 'purple', port: 5678, uptime: '99.7%' },
  { id: 'nextcloud', name: 'Nextcloud', url: 'http://localhost:8080', icon: Cloud, color: 'indigo', port: 8080, uptime: '100%' },
  { id: 'cockpit', name: 'Cockpit', url: 'https://cockpit.shahbaz.online/', icon: KanbanSquare, color: 'red', port: 9090, uptime: '99.9%' },
];

export const MY_PROJECTS: MonitoredService[] = [
  { id: 'project-1', name: 'evntos', url: 'https://evntoswebapp.vercel.app/', icon: ShoppingCart, color: 'orange', port: 443, uptime: '100%'},
  { id: 'project-2', name: 'Project 2', url: 'https://example.org', icon: GalleryHorizontal, color: 'red', port: 443, uptime: '100%' },
  { id: 'personal-portfolio', name: 'Portfolio', url: 'https://shahbaz.info/', icon: Code, color: 'blue', port: 443, uptime: '100%' },
  { id: 'another-project', name: 'Project 2', url: 'https://armanautoxperts.vercel.app/', icon: Globe, color: 'green', port: 443, uptime: '100%' },
];
