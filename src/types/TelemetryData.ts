import {TpsDataPoint} from "@/types/TpsDataPoint";

export interface TelemetryData {
	status: string;
	ramUsage: number;
	totalRam: number;
	cpuUsage: number;
	cpuModel: string;
	cpuCores: number;
	cpuThreads: number;
	uptime: number;
	onlinePlayers: number;
	maxPlayers: number;
	tps: number;
	storageUsed?: number;
	tpsHistory: TpsDataPoint[];
}