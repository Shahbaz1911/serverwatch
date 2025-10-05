import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Base URL for the Netdata API
const NETDATA_BASE_URL = 'http://localhost:19999/api/v1';

async function fetchFromNetdata(url: string) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            console.error(`Netdata API error for ${url}:`, response.status, response.statusText);
            const errorText = await response.text();
            console.error('Netdata response:', errorText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from Netdata at ${url}:`, error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const fetchCpu = fetchFromNetdata(`${NETDATA_BASE_URL}/data?chart=system.cpu&after=-1&points=1&group=average&format=json`);
    const fetchRam = fetchFromNetdata(`${NETDATA_BASE_URL}/data?chart=system.ram&after=-1&points=1&group=average&format=json`);
    const fetchDisk = fetchFromNetdata(`${NETDATA_BASE_URL}/data?chart=disk_space._&after=-1&points=1&group=average&format=json`);

    const [cpuData, ramData, diskData] = await Promise.all([fetchCpu, fetchRam, fetchDisk]);

    const cpu = cpuData?.data?.[0]?.[1] ?? 0;
    
    // Netdata system.ram provides 'free', 'used', 'cached', 'buffers'. We want percentage of used.
    const ramUsed = ramData?.data?.[0]?.[ramData.dimension_names.indexOf('used')] ?? 0;
    const ramFree = ramData?.data?.[0]?.[ramData.dimension_names.indexOf('free')] ?? 0;
    const ramCached = ramData?.data?_.[0]?.[ramData.dimension_names.indexOf('cached')] ?? 0;
    const ramBuffers = ramData?.data?.[0]?.[ramData.dimension_names.indexOf('buffers')] ?? 0;
    const totalRam = ramUsed + ramFree + ramCached + ramBuffers;
    const ram = totalRam > 0 ? (ramUsed / totalRam) * 100 : 0;
    
    // Netdata disk_space provides used percentage directly for the root disk.
    const disk = diskData?.data?.[0]?.[1] ?? 0;

    return NextResponse.json({
        cpu: parseFloat(cpu.toFixed(1)),
        ram: parseFloat(ram.toFixed(1)),
        disk: parseFloat(disk.toFixed(1)),
    });
}
