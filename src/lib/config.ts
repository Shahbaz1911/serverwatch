import type { LucideIcon } from "lucide-react";
import { Server, Cloud, LineChart, Zap, Globe, ShoppingCart, GalleryHorizontal, Code } from 'lucide-react';

export interface MonitoredService {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
  color: string;
}

export const SERVER_APPS: MonitoredService[] = [
  { id: 'portainer', name: 'Portainer', url: 'http://localhost:9000', icon: Server, color: 'blue' },
  { id: 'netdata', name: 'Netdata', url: 'http://localhost:19999', icon: LineChart, color: 'green' },
  { id: 'n8n', name: 'n8n', url: 'http://localhost:5678', icon: Zap, color: 'purple' },
  { id: 'nextcloud', name: 'Nextcloud', url: 'http://localhost:8080', icon: Cloud, color: 'indigo' },
];

export const MY_PROJECTS: MonitoredService[] = [
  { id: 'shop-armanautoxperts', name: 'shop.armanautoxperts.in', url: 'https://shop.armanautoxperts.in', icon: ShoppingCart, color: 'orange' },
  { id: 'gallery-armanautoxperts', name: 'gallery.armanautoxperts.in', url: 'https://gallery.armanautoxperts.in', icon: GalleryHorizontal, color: 'red' },
  { id: 'personal-portfolio', name: 'Portfolio', url: 'https://example.com', icon: Code, color: 'blue' },
  { id: 'another-project', name: 'Another Project', url: 'https://example.dev', icon: Globe, color: 'green' },
];
