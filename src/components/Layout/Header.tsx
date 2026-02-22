'use client'
import { ActivePage } from "@/app/page";

const pageTitles: Record<ActivePage, { title: string; subtitle: string }> = {
	server: { title: "Server Overview", subtitle: "Real-time telemetry" },
	console: { title: "Console", subtitle: "Gives you access to the ingame console." },
};

interface HeaderProps {
	activePage: ActivePage;
}

export default function Header({ activePage }: HeaderProps) {
	const { title, subtitle } = pageTitles[activePage];
	const now = new Date();
	const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const dateString = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

	return (
		<header className="h-16 px-6 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0">
			{/* Left: breadcrumb */}
			<div className="flex items-center gap-3">
				<div>
					<h2 className="font-semibold text-sm text-[var(--color-text-primary)] font-[var(--font-heading)] leading-none">
						{title}
					</h2>
					<p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
				</div>
			</div>

			{/* Right: clock + status badge */}
			<div className="flex items-center gap-4">
				<div className="text-right hidden sm:block">
					<p className="text-xs font-medium text-[var(--color-text-primary)] font-[var(--font-mono)]">{timeString}</p>
					<p className="text-[10px] text-[var(--color-text-muted)]">{dateString}</p>
				</div>

				<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-[var(--font-heading)]"
				     style={{ background: "color-mix(in srgb, #34d399 12%, transparent)", color: "#34d399" }}>
					<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
					Live
				</div>
			</div>
		</header>
	);
}