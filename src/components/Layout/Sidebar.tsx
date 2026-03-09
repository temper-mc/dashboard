"use client";
import { FaChartLine, FaServer } from "react-icons/fa";
import type { ActivePage } from "@/app/page";

const items: { icon: React.ElementType; label: string; id: ActivePage }[] = [
	{ icon: FaServer, label: "Server", id: "server" },
	{ icon: FaChartLine, label: "Console", id: "console" },
];

interface SidebarProps {
	activePage: ActivePage;
	setActivePage: (page: ActivePage) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
	return (
		<aside className="w-20 flex flex-col items-center py-6 gap-2 bg-bg-secondary border-r border-border relative z-10">
			{/* Logo mark */}
			<div
				className="mb-6 w-10 h-10 rounded-xl flex items-center justify-center"
				style={{
					background:
						"linear-gradient(135deg, var(--color-gb-primary), var(--color-primary))",
				}}
			>
				<img
					className="text-white text-sm font-(--font-heading)"
					src="/favicon.webp"
					alt="Temper"
				></img>
			</div>

			<div className="flex flex-col gap-1 w-full px-2">
				{items.map((item) => {
					const Icon = item.icon;
					const isActive = activePage === item.id;
					return (
						<button
							key={item.id}
							onClick={() => setActivePage(item.id)}
							title={item.label}
							className={`
                                flex flex-col items-center gap-1 py-3 rounded-xl w-full transition-all duration-200 cursor-pointer
                                ${isActive ? "bg-info text-white shadow-md" : "text-text-muted hover:text-primary hover:bg-[color-mix(in_srgb,var(--color-info)_10%,transparent)]"}
                            `}
						>
							<Icon size={20} />
							<span className="text-[10px] font-medium">{item.label}</span>
						</button>
					);
				})}
			</div>

			{/* Bottom indicator dot */}
			<div
				className="mt-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]"
				title="Connected"
			/>
		</aside>
	);
}
