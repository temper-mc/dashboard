'use client'
import {useState} from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import ServerPage from "@/components/Pages/ServerPage";
import ConsolePage from "@/components/Pages/ConsolePage";

export type ActivePage = "server" | "console";

export default function Home() {
	const [activePage, setActivePage] = useState<ActivePage>("server");

	return (<div className="min-h-screen flex bg-bg-primary text-text-primary overflow-hidden">
			{/* Sidebar */}
			<Sidebar activePage={activePage} setActivePage={setActivePage}/>

			{/* Main area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Header */}
				<Header activePage={activePage}/>

				{/* Content */}
				<main className="flex-1 p-6 overflow-auto">
					{activePage === "server" && <ServerPage/>}
					{activePage === "console" && <ConsolePage/>}
				</main>
			</div>
		</div>);
}

