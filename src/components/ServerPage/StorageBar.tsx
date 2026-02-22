import {FaHdd} from "react-icons/fa";

export default function StorageBar({ used, total }: { used: number; total: number }) {
	const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
	const usedGb = (used / 1024 ** 3).toFixed(2);
	const totalGb = (total / 1024 ** 3).toFixed(2);
	const color = pct > 85 ? '#f87171' : pct > 60 ? '#fbbf24' : '#34d399';

	return (
		<div className="card flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg flex items-center justify-center"
					     style={{ background: 'rgba(117,219,205,0.15)', color: '#75DBCD' }}>
						<FaHdd size={13} />
					</div>
					<span className="text-[10px] font-semibold text-[var(--color-text-muted)] font-[var(--font-heading)] uppercase tracking-widest">
                        Storage Used
                    </span>
				</div>
				<span className="text-xs font-[var(--font-mono)] text-[var(--color-text-muted)]">
                    {usedGb} / {totalGb} GB
                </span>
			</div>

			{/* Bar track */}
			<div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
				/>
			</div>

			<p className="text-xs text-[var(--color-text-muted)] -mt-1">
				{pct.toFixed(1)}% of disk used
			</p>
		</div>
	);
}
