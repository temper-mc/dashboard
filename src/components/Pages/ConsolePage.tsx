'use client'
import {useEffect, useRef, useState} from "react";
import {telemetry} from "@/utility/telemetry";

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogEntry {
	id: number;
	time: string;
	level: LogLevel;
	message: string;
}

const INITIAL_LOGS: LogEntry[] = [
	{id: 1, time: '14:20:01', level: 'INFO', message: 'Starting server...'}, {
		id: 2,
		time: '14:20:02',
		level: 'INFO',
		message: 'Server setup complete.'
	}, {id: 3, time: '14:20:02', level: 'DEBUG', message: 'Starting temper dashboard webserver...'}, {
		id: 4,
		time: '14:20:05',
		level: 'INFO',
		message: 'Server is ready in 10.15 ms'
	}, {id: 5, time: '14:23:01', level: 'DEBUG', message: "Server listening on 0.0.0.0:25565"}, {
		id: 6,
		time: '14:23:01',
		level: 'DEBUG',
		message: "Handshake data gathered: Handshake { system: SystemData { cpu_model: \"Intel(R) Core(TM) i9-14900K\",cpu_cores: 24, cpu_threads: 32 }, config: ConfigData { max_players: 100 } }"
	}, {id: 7, time: '14:23:05', level: 'DEBUG', message: "Starting server telemetry  "}, {
		id: 8,
		time: '14:24:12',
		level: 'INFO',
		message: "Dashboard listening on http://0.0.0.0:9000"
	},
];

const LEVEL_CONFIG: Record<LogLevel, { label: string; color: string; bg: string; dot: string }> = {
	INFO: {label: 'INFO', color: '#34d399', bg: 'rgba(52,211,153,0.08)', dot: '#34d399'},
	WARN: {label: 'WARN', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', dot: '#fbbf24'},
	ERROR: {label: 'ERROR', color: '#f87171', bg: 'rgba(248,113,113,0.08)', dot: '#f87171'},
	DEBUG: {label: 'DEBUG', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', dot: '#a78bfa'},
};

const LEVEL_FILTERS: (LogLevel | 'ALL')[] = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'];

let nextId = INITIAL_LOGS.length + 1;

export default function ConsolePage() {
	const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
	const [command, setCommand] = useState('');
	const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');
	const [search, setSearch] = useState('');
	const logEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-scroll to bottom on new logs
	useEffect(() => {
		logEndRef.current?.scrollIntoView({behavior: 'smooth'});
	}, [logs]);

	// Focus input on mount
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || !command.trim()) return;
		telemetry.sendCommand(command);
		const now = new Date();
		const time = now.toLocaleTimeString('en-US', {
			hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
		});
		setLogs(prev => [
			...prev, {
				id: nextId++, time, level: 'INFO', message: `> Currently an actual Console is not supported.`,
			}
		]);
		setCommand('');
	};

	const filteredLogs = logs.filter(log => {
		const matchLevel = filter === 'ALL' || log.level === filter;
		const matchSearch = !search || log.message.toLowerCase().includes(search.toLowerCase());
		return matchLevel && matchSearch;
	});

	const counts = (['INFO', 'WARN', 'ERROR', 'DEBUG'] as LogLevel[]).reduce((acc, lvl) => ({
		...acc,
		[lvl]: logs.filter(l => l.level === lvl).length
	}), {} as Record<LogLevel, number>);

	return (<div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
			{/* Toolbar: level filter + search */}
			<div className="flex flex-wrap items-center gap-2 shrink-0">
				{/* Level pills */}
				<div
					className="flex gap-1 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
					{LEVEL_FILTERS.map(lvl => {
						const isActive = filter === lvl;
						const cfg = lvl !== 'ALL' ? LEVEL_CONFIG[lvl] : null;
						return (<button
								key={lvl}
								onClick={() => setFilter(lvl)}
								className="px-3 py-1 rounded-lg text-xs font-semibold font-[var(--font-heading)] transition-all duration-150 cursor-pointer"
								style={isActive && cfg ? {
									background: cfg.bg,
									color: cfg.color
								} : isActive ? {
									background: 'var(--color-bg-primary)',
									color: 'var(--color-text-primary)'
								} : {color: 'var(--color-text-muted)'}}
							>
								{lvl}
								{lvl !== 'ALL' && (
									<span className="ml-1.5 opacity-60">{counts[lvl as LogLevel]}</span>)}
							</button>);
					})}
				</div>

				{/* Search */}
				<input
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Filter messages…"
					className="flex-1 min-w-[160px] text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-border-hover)] transition-colors font-[var(--font-mono)]"
				/>

				{/* Count badge */}
				<span className="text-xs text-[var(--color-text-muted)] font-[var(--font-mono)] ml-auto">
                    {filteredLogs.length} / {logs.length} lines
                </span>
			</div>

			{/* Terminal window */}
			<div
				className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-[var(--color-border)] min-h-0"
				style={{background: 'rgba(6, 7, 14, 0.92)', boxShadow: 'var(--shadow-xl)'}}
				onClick={() => inputRef.current?.focus()}
			>
				{/* Terminal title bar */}
				<div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0"
				     style={{borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)'}}>
					<span className="w-3 h-3 rounded-full bg-red-500/70"/>
					<span className="w-3 h-3 rounded-full bg-yellow-500/70"/>
					<span className="w-3 h-3 rounded-full bg-green-500/70"/>
					<span className="ml-3 text-xs text-white/30 font-[var(--font-mono)]">
                        temper — console
                    </span>
				</div>

				{/* Log lines */}
				<div className="flex-1 overflow-y-auto p-4 space-y-0.5 scroll-smooth">
					{filteredLogs.length === 0 && (
						<p className="text-white/20 text-sm font-[var(--font-mono)] text-center mt-8">
							No log entries match your filter.
						</p>)}
					{filteredLogs.map((log, i) => {
						const cfg = LEVEL_CONFIG[log.level];
						const isCommand = log.message.startsWith('> ');
						return (<div
								key={log.id}
								className="flex items-start gap-2 px-2 py-0.5 rounded-md text-xs group"
								style={{
									background: isCommand ? 'rgba(255,255,255,0.04)' : 'transparent',
									animationDelay: `${Math.min(i * 20, 300)}ms`,
								}}
							>
								{/* Timestamp */}
								<span className="shrink-0 font-[var(--font-mono)] text-blue-400/60 select-none mt-px">
                                    [{log.time}]
                                </span>

								{/* Level badge */}
								<span
									className="shrink-0 font-[var(--font-mono)] font-bold w-[46px] text-center rounded px-1 mt-px text-[10px]"
									style={{color: cfg.color, background: cfg.bg}}
								>
                                    {cfg.label}
                                </span>

								{/* Message */}
								<span
									className="font-[var(--font-mono)] leading-relaxed break-all"
									style={{color: isCommand ? '#fff' : 'rgba(220,220,240,0.8)'}}
								>
                                    {log.message}
                                </span>
							</div>);
					})}
					<div ref={logEndRef}/>
				</div>

				{/* Command input */}
				<div
					className="shrink-0 px-4 py-3 border-t flex items-center gap-3"
					style={{borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)'}}
				>
					<span className="text-[var(--color-info)] font-[var(--font-mono)] text-sm select-none">›</span>
					<input
						ref={inputRef}
						type="text"
						value={command}
						onChange={e => setCommand(e.target.value)}
						onKeyDown={handleCommand}
						placeholder="Type a command and press Enter…"
						className="flex-1 bg-transparent border-none outline-none text-sm font-[var(--font-mono)] text-white placeholder:text-white/20 caret-[var(--color-info)]"
					/>
					<kbd
						className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-white/25 font-[var(--font-mono)] select-none">
						⏎
					</kbd>
				</div>
			</div>
		</div>);
}