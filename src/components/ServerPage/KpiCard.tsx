import Sparkline from "@/components/ServerPage/Sparkline";
import ProgressBar from "@/components/ServerPage/ProgressBar";

interface KpiCardProps {
	label: string;
	value: React.ReactNode;
	icon: React.ElementType;
	iconColor: string;
	iconBg: string;
	barColor: string;
	barPct: number;
	history: number[];
	histMin?: number;
	histMax?: number;
	sparkColor: string;
}

export default function KpiCard({ label, value, icon: Icon, iconColor, iconBg, barColor, barPct, history, histMin, histMax, sparkColor }: KpiCardProps) {
	return (
		<div className="card flex flex-col gap-3 relative overflow-hidden group">
			<div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
			     style={{ background: sparkColor }} />

			<div className="flex items-start justify-between">
				<div>
					<p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-[var(--font-heading)]">
						{label}
					</p>
					<div className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] mt-1 leading-none">
						{value}
					</div>
				</div>
				<div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
				     style={{ background: iconBg, color: iconColor }}>
					<Icon size={16} />
				</div>
			</div>

			<ProgressBar pct={barPct} color={barColor} />

			{history.length > 1 && (
				<div className="-mx-1 -mb-1">
					<Sparkline data={history} min={histMin} max={histMax} color={sparkColor} height={36} />
				</div>
			)}
		</div>
	);
}