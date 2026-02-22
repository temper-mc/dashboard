import {TelemetryData} from "@/types/TelemetryData";

export interface TelemetryState {
	connected: boolean;
	data: TelemetryData;
}