import { TelemetryState } from "@/types/TelemetryState";

const preferredWsPort: string = "9000";

type TpsDataPoint = { time: Date; tps: number };

class TelemetryStore {
	private socket: WebSocket | null = null;
	private _state: TelemetryState = {
		connected: false,
		data: {
			os: "Unknown",
			status: "Offline",
			ramUsage: 0,
			totalRam: 0,
			cpuUsage: 0,
			cpuModel: "Unknown",
			cpuCores: 0,
			cpuThreads: 0,
			uptime: 0,
			onlinePlayers: 0,
			maxPlayers: 0,
			tps: 20,
			storageUsed: undefined,
			tpsHistory: [],
			players: [],
		},
	};

	constructor() {
		this.initializeDemoTpsHistory();
	}

	private initializeDemoTpsHistory() {
		const now = Date.now();
		const demoData: TpsDataPoint[] = [];
		const tpsValues = [
			20, 20, 19.8, 20, 20, 19.5, 18.2, 19.0, 20, 20, 20, 19.9, 20, 20, 20,
		];

		for (let i = 0; i < tpsValues.length; i++) {
			demoData.push({
				time: new Date(now - (tpsValues.length - 1 - i) * 60000),
				tps: tpsValues[i],
			});
		}

		this._state.data.tpsHistory = demoData;
	}

	get state() {
		return this._state;
	}

	connect() {
		if (typeof window === "undefined") return;

		const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		const addressIp = window.location.hostname;
		const addressPort =
			preferredWsPort ||
			new URLSearchParams(window.location.search).get("ws_port") ||
			window.location.port;
		const address = addressPort ? `${addressIp}:${addressPort}` : addressIp;

		this.socket = new WebSocket(`${protocol}//${address}/ws`);

		this.socket.onopen = () => {
			console.log("Connected to FerrumC Telemetry");
			this._state.connected = true;
			this._state.data.status = "Running";
		};

		this.socket.onmessage = (event) => {
			try {
				const payload = JSON.parse(event.data);
				if (payload.type === "Handshake") {
					this.updateHandshake(payload.data);
				} else if (payload.type === "Metric") {
					this.updateMetrics(payload.data);
				}
			} catch (e) {
				console.error("Error parsing WebSocket message:", e);
			}
		};

		this.socket.onclose = () => {
			console.log("Disconnected. Retrying in 2s...");
			this._state.connected = false;
			this._state.data.status = "Offline";
			setTimeout(() => this.connect(), 2000);
		};

		this.socket.onerror = (err) => {
			console.error("WebSocket error:", err);
			this.socket?.close();
		};
	}

	disconnect() {
		this.socket?.close();
		this.socket = null;
	}

	sendCommand(command: string) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({ type: "Command", data: command }));
		}
	}

	private updateHandshake(data: any) {
		if (data.system) {
			if (data.system.cpu_model !== undefined)
				this._state.data.cpuModel = data.system.cpu_model;
			if (data.system.cpu_cores !== undefined)
				this._state.data.cpuCores = data.system.cpu_cores;
			if (data.system.cpu_threads !== undefined)
				this._state.data.cpuThreads = data.system.cpu_threads;
			if (data.system.os !== undefined) this._state.data.os = data.system.os;
		}
		if (data.config) {
			if (data.config.max_players !== undefined)
				this._state.data.maxPlayers = data.config.max_players;
		}
	}

	private updateMetrics(data: any) {
		if (data.ram_usage !== undefined)
			this._state.data.ramUsage = data.ram_usage;
		if (data.total_ram !== undefined)
			this._state.data.totalRam = data.total_ram;
		if (data.cpu_usage !== undefined)
			this._state.data.cpuUsage = data.cpu_usage;
		if (data.uptime !== undefined) this._state.data.uptime = data.uptime;
		if (data.player_count !== undefined)
			this._state.data.onlinePlayers = data.player_count;
		if (data.online_players !== undefined)
			this._state.data.onlinePlayers = data.online_players;
		if (data.max_players !== undefined)
			this._state.data.maxPlayers = data.max_players;
		if (data.storage_used !== undefined)
			this._state.data.storageUsed = data.storage_used;
		if (data.tps !== undefined) {
			this._state.data.tps = data.tps;
			this._state.data.tpsHistory = [
				...this._state.data.tpsHistory.slice(19),
				{ time: new Date(), tps: data.tps },
			];
		}
		if (data.players !== undefined) this._state.data.players = data.players;
	}
}

export const telemetry = new TelemetryStore();
