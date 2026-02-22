import React from "react";
import Sparkline from "@/components/ServerPage/Sparkline";

interface MetricCardProps {
	icon: React.ElementType;
	label: string;
	value: string;
	sub?: string;
	history: number[];
	histMin?: number;
	histMax?: number;
	color: string;
	accent: string;
	badge?: { text: string; ok: boolean };
}

export default function MetricCard({
	                    icon: Icon, label, value, sub,
	                    history, histMin, histMax,
	                    color, accent, badge,
                    }: MetricCardProps) {
	return (
		<div className="card flex flex-col gap-2 relative overflow-hidden group">
			{/* Blob */}
			<div
				className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
				style={{ background: accent }}
			/>

			{/* Header row */}
			<div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] font-[var(--font-heading)] uppercase tracking-widest">
                    {label}
                </span>
				<div
					className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
					style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}
				>
					<Icon size={13} />
				</div>
			</div>

			{/* Value */}
			<div className="flex items-end gap-2">
                <span className="text-2xl font-bold font-[var(--font-heading)] leading-none" style={{ color }}>
                    {value}
                </span>
				{badge && (
					<span
						className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-0.5 font-[var(--font-heading)]"
						style={{
							color: badge.ok ? '#34d399' : '#f87171',
							background: badge.ok ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
						}}
					>
                        {badge.text}
                    </span>
				)}
			</div>

			{sub && (
				<p className="text-xs text-[var(--color-text-muted)] -mt-1">{sub}</p>
			)}

			{/* Sparkline */}
			<div className="mt-1 -mx-1">
				<Sparkline data={history} min={histMin} max={histMax} color={accent} height={40} />
			</div>
		</div>
	);
}
