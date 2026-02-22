import ProgressBar from "@/components/ServerPage/ProgressBar";

export default function ResourceRow({ icon: Icon, label, value, sub, pct, color }: {
	icon: React.ElementType; label: string; value: string;
	sub?: string; pct: number; color: string;
}) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                    <Icon size={13} /> {label}
                </span>
				<span className="font-[var(--font-mono)] font-bold text-sm text-[var(--color-text-primary)]">
                    {value}
                </span>
			</div>
			<ProgressBar pct={pct} color={color} />
			{sub && <p className="text-xs text-[var(--color-text-muted)] truncate" title={sub}>{sub}</p>}
		</div>
	);
}
