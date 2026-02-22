'use client'
import {useRef, useState} from "react";

export default function TpsChart({history}: { history: { time: Date; tps: number }[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [size] = useState({ w: 650, h: 200 });

	const { w: W, h: H } = size;
	const PAD = { top: 12, right: 12, bottom: 28, left: 32 };
	const iW = W - PAD.left - PAD.right;
	const iH = H - PAD.top  - PAD.bottom;

	if (history.length < 2) {
		return (<div
			className="flex items-center justify-center h-[150px] text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">
			Collecting data…
		</div>);
	}

	const pts: [number, number][] = history.map((d, i) => [
		PAD.left + (i / (history.length - 1)) * iW, PAD.top + (1 - d.tps / 20) * iH,
	]);

	const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
	const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${PAD.top + iH} L${PAD.left},${PAD.top + iH} Z`;

	const yTicks = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
	const xStep = Math.max(1, Math.floor((history.length - 1) / 4));
	const xLabels = [0, 0.25, 0.5, 0.75, 1].map(frac => {
		const idx = Math.round(frac * (history.length - 1));
		return {
			x: PAD.left + frac * iW,
			label: history[idx].time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
		};
	});

	return (<div ref={containerRef} className="w-full h-full min-h-0 flex-1">
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
			<defs>
				<linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#10b981" stopOpacity="0.35"/>
					<stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
				</linearGradient>
			</defs>

			{yTicks.map(v => {
				const y = PAD.top + (1 - v / 20) * iH;
				return (<g key={v}>
					<line x1={PAD.left} y1={y} x2={PAD.left + iW} y2={y}
					      stroke="var(--color-border)" strokeWidth="1"/>
					<text x={PAD.left - 5} y={y + 3.5} textAnchor="end"
					      fill="var(--color-text-muted)" fontSize={9}>{v}</text>
				</g>);
			})}

			{xLabels.map(({x, label}, i) => (
				<text key={i} x={x} y={H - 6} textAnchor="middle" fill="var(--color-text-muted)" fontSize={9}>
					{label}
				</text>))}

			<path d={area} fill="url(#tpsGrad)"/>
			<path d={line} fill="none" stroke="#10b981" strokeWidth="2"
			      strokeLinejoin="round" strokeLinecap="round"/>
			<circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill="#10b981"/>
		</svg>
	</div>);
}