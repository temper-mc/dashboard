export default function ProgressBar({ pct, color }: { pct: number; color: string }) {
	return (
		<div className="w-full h-1.5 rounded-full overflow-hidden bg-[var(--color-border)]">
			<div
				className="h-full rounded-full transition-all duration-500"
				style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, background: color }}
			/>
		</div>
	);
}