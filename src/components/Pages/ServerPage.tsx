'use client'
import React, {useEffect, useState} from "react";
import {telemetry} from "@/utility/telemetry";
import {FaHdd, FaMemory, FaMicrochip, FaServer, FaUsers} from "react-icons/fa";
import KpiCard from "@/components/ServerPage/KpiCard";
import TpsChart from "@/components/ServerPage/TpsChart";
import ProgressBar from "@/components/ServerPage/ProgressBar";
import ResourceRow from "@/components/ServerPage/ResourceRow";

const MAX_HISTORY = 60;

function pushHistory(arr: number[], val: number): number[] {
	const next = [...arr, val];
	return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
}

function formatUptime(secs: number): string {
	const d = Math.floor(secs / 86400);
	const h = Math.floor((secs % 86400) / 3600);
	const m = Math.floor((secs % 3600) / 60);
	const s = secs % 60;
	if (d > 0) return `${d}d ${h}h ${m}m`;
	if (h > 0) return `${h}h ${m}m ${s}s`;
	return `${m}m ${s}s`;
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(i > 1 ? 1 : 0)} ${units[i]}`;
}

function makeEmptyTpsHistory(): { time: Date; tps: number }[] {
	const now = Date.now();
	return Array.from({ length: 60 }, (_, i) => ({
		time: new Date(now - (59 - i) * 1000),
		tps: 0,
	}));
}

interface Histories {
	cpu: number[];
	ram: number[];
	tps: number[];
	players: number[];
	tpsHistory: { time: Date; tps: number }[];
}

const MAX_TPS_HISTORY = 60;

function pushTpsHistory(
	arr: { time: Date; tps: number }[],
	tps: number
): { time: Date; tps: number }[] {
	const next = [...arr, { time: new Date(), tps }];
	return next.length > MAX_TPS_HISTORY ? next.slice(-MAX_TPS_HISTORY) : next;
}


const LOG_COLORS: Record<string, string> = {
	INFO: "#34d399", WARN: "#fbbf24", ERROR: "#f87171", DEBUG: "#a78bfa",
};

const SAMPLE_LOGS = [
	{
		time: "14:23:01",
		level: "INFO",
		message: "Handshake data gathered: Handshake { system: SystemData { cpu_model: \"Intel(R) Core(TM) i9-14900K\",cpu_cores: 24, cpu_threads: 32 }, config: ConfigData { max_players: 100 } }"
	}, {
		time: "14:23:05", level: "INFO", message: "Starting server telemetry"
	}, {time: "14:24:12", level: "DEBUG", message: "Dashboard listening on http://0.0.0.0:9000"},
];

export default function ServerPage() {
	const [data, setData] = useState(telemetry.state.data);
	const [histories, setHistories] = useState<Histories>({
		cpu: Array(60).fill(0),
		ram: Array(60).fill(0),
		tps: Array(60).fill(0),
		players: Array(60).fill(0),
		tpsHistory: makeEmptyTpsHistory(),
	});

	useEffect(() => {
		telemetry.connect();
		const tick = setInterval(() => {
			const d = telemetry.state.data;
			setData({...d});
			setHistories(prev => ({
				cpu: pushHistory(prev.cpu, d.cpuUsage),
				ram: pushHistory(prev.ram, d.ramUsage),
				tps: pushHistory(prev.tps, d.tps),
				players: pushHistory(prev.players, d.onlinePlayers),
				tpsHistory: pushTpsHistory(prev.tpsHistory, d.tps),
			}));
		}, 1000);

		return () => {
			clearInterval(tick);
			telemetry.disconnect();
		};
	}, []);

		const ramPct = data.totalRam > 0 ? (data.ramUsage / data.totalRam) * 100 : 0;
		const playersPct = data.maxPlayers > 0 ? (data.onlinePlayers / data.maxPlayers) * 100 : 0;
		const tpsOk = data.tps >= 19;
		const tpsDeg = data.tps >= 15;
		const tpsColor = tpsOk ? "#34d399" : tpsDeg ? "#fbbf24" : "#f87171";

		return (<div className="space-y-6">

			{/* ── KPI row ──────────────────────────────────────────────────── */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<KpiCard
					label="Players"
					value={<>
						{data.onlinePlayers}
						<span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">
                                / {data.maxPlayers}
                            </span>
					</>}
					icon={FaUsers}
					iconColor="#60a5fa" iconBg="rgba(96,165,250,0.12)"
					barColor="#60a5fa" barPct={playersPct}
					history={histories.players} histMin={0} histMax={data.maxPlayers || 20}
					sparkColor="#60a5fa"
				/>

				<KpiCard
					label="Memory"
					value={formatBytes(data.ramUsage)}
					icon={FaServer}
					iconColor="var(--color-info)" iconBg="rgba(163,133,229,0.12)"
					barColor="var(--color-info)" barPct={ramPct}
					history={histories.ram} histMin={0} histMax={data.totalRam || 1}
					sparkColor="#A385E5"
				/>

				<KpiCard
					label="CPU Load"
					value={`${data.cpuUsage.toFixed(0)}%`}
					icon={FaMicrochip}
					iconColor="#a78bfa" iconBg="rgba(167,139,250,0.12)"
					barColor="#a78bfa" barPct={data.cpuUsage}
					history={histories.cpu} histMin={0} histMax={100}
					sparkColor="#a78bfa"
				/>
			</div>

			{/* ── TPS chart + System Resources ─────────────────────────────── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

				{/* TPS chart – 2/3 */}
				<div className="lg:col-span-2 card">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-base font-semibold text-[var(--color-text-primary)] font-[var(--font-heading)]">
								Performance Metrics
							</h3>
							<p className="text-xs text-[var(--color-text-muted)] mt-0.5">
								Ticks Per Second (TPS) — last {histories.tpsHistory.length}s
							</p>
						</div>
						<div className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full" style={{background: tpsColor}}/>
							<span className="text-xs font-[var(--font-mono)] font-bold" style={{color: tpsColor}}>
                                {data.tps} TPS
                            </span>
							<span
								className="text-[10px] px-2 py-0.5 rounded-full font-[var(--font-heading)] font-semibold ml-1"
								style={{color: tpsColor, background: `${tpsColor}20`}}
							>
                                {tpsOk ? "Healthy" : tpsDeg ? "Degraded" : "Critical"}
                            </span>
						</div>
					</div>
					<TpsChart history={histories.tpsHistory}/>
				</div>

				{/* System Resources – 1/3 */}
				<div className="card flex flex-col gap-5">
					<h3 className="text-base font-semibold text-[var(--color-text-primary)] font-[var(--font-heading)]">
						System Resources
					</h3>

					{/* CPU detail */}
					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                                <FaMicrochip size={13}/> CPU Usage
                            </span>
							<span
								className="font-[var(--font-mono)] font-bold text-sm text-[var(--color-text-primary)]">
                                {data.cpuUsage.toFixed(0)}%
                            </span>
						</div>
						<ProgressBar pct={data.cpuUsage} color="#a78bfa"/>
						{data.cpuModel !== "Unknown" && (
							<p className="text-xs text-[var(--color-text-muted)] truncate" title={data.cpuModel}>
								{data.cpuModel}
							</p>)}
						{(data.cpuCores > 0 || data.cpuThreads > 0) && (
							<p className="text-xs text-[var(--color-text-muted)] opacity-70">
								{data.cpuCores} cores / {data.cpuThreads} threads
							</p>)}
					</div>

					<ResourceRow
						icon={FaMemory}
						label="Memory"
						value={`${ramPct.toFixed(1)}%`}
						sub={`${formatBytes(data.ramUsage)} / ${formatBytes(data.totalRam)} allocated`}
						pct={ramPct}
						color="var(--color-info)"
					/>

					<ResourceRow
						icon={FaHdd}
						label="World Size"
						value={formatBytes(data.storageUsed ?? 0)}
						sub="Current disk usage for world directory"
						pct={100}
						color="#34d399"
					/>

					<div className="space-y-1">
						<p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-[var(--font-heading)]">
							Uptime
						</p>
						<p className="text-lg font-bold font-[var(--font-mono)] text-[var(--color-primary)]">
							{formatUptime(data.uptime)}
						</p>
					</div>
				</div>
			</div>

			{/* ── Recent Console Activity ───────────────────────────────────── */}
			<div className="card overflow-hidden p-0" style={{opacity: 0.75}}>
				<div
					className="px-5 py-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-secondary)]">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-semibold text-[var(--color-text-primary)] font-[var(--font-heading)]">
							Recent Console Activity
						</h3>
						<span
							className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)]">
                            Placeholder
                        </span>
					</div>
				</div>
				<div className="p-4 space-y-1.5 font-[var(--font-mono)] text-xs text-[var(--color-text-muted)]"
				     style={{background: "rgba(0,0,0,0.2)"}}>
					{SAMPLE_LOGS.map((log, i) => (<div key={i} className="flex gap-3">
						<span className="opacity-50 shrink-0">{log.time}</span>
						<span className="shrink-0 font-bold" style={{color: LOG_COLORS[log.level]}}>
                                [{log.level}]
                            </span>
						<span>{log.message}</span>
					</div>))}
				</div>
			</div>

		</div>
		);
	}