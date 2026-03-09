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
	history?: number[];
	histMin?: number;
	histMax?: number;
	sparkColor: string;
	subtitle?: string;
}

export default function KpiCard({
	label,
	value,
	icon: Icon,
	iconColor,
	iconBg,
	barColor,
	barPct,
	history,
	histMin,
	histMax,
	sparkColor,
	subtitle,
}: KpiCardProps) {
	return (
		<div className="card flex flex-col gap-3 relative overflow-hidden group">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-[var(--font-heading)]">
						{label}
					</p>
					{
						<p className="text-xs text-[var(--color-text-muted)] mt-1">
							{subtitle ? subtitle : ""}
						</p>
					}
					<div className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)] mt-1 leading-none">
						{value}
					</div>
				</div>
				<div
					className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
					style={{ background: iconBg, color: iconColor }}
				>
					<div
						className="absolute w-12 h-12 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
						style={{ background: sparkColor }}
					/>
					<Icon size={16} />
				</div>
			</div>

			<ProgressBar pct={barPct} color={barColor} />

			{history && history.length > 1 && (
				<div className="-mx-1 -mb-1">
					<Sparkline
						data={history}
						min={histMin}
						max={histMax}
						color={sparkColor}
						height={36}
					/>
				</div>
			)}
		</div>
	);
}
