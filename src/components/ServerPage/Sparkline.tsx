import React from "react";

interface SparklineProps {
	data: number[];
	min?: number;
	max?: number;
	color: string;
	height?: number;
}

export default function Sparkline({ data, min, max, color, height = 40 }: SparklineProps) {
	if (data.length < 2) return <div style={{ height }} />;

	const lo = min ?? Math.min(...data);
	const hi = max ?? Math.max(...data);
	const range = hi - lo || 1;

	const W = 200;
	const H = height;
	const PAD = 2;

	const pts = data.map((v, i) => {
		const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
		const y = PAD + (1 - (v - lo) / range) * (H - PAD * 2);
		return [x, y] as [number, number];
	});

	const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
	const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;

	const gradId = `sg-${color.replace(/[^a-z0-9]/gi, '')}`;

	return (
		<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={height}>
			<defs>
				<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.25" />
					<stop offset="100%" stopColor={color} stopOpacity="0" />
				</linearGradient>
			</defs>
			<path d={areaPath} fill={`url(#${gradId})`} />
			<path d={linePath} fill="none" stroke={color} strokeWidth="1.5"
			      strokeLinejoin="round" strokeLinecap="round" />
			{/* last dot */}
			<circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]}
			        r="2.5" fill={color} />
		</svg>
	);
}
