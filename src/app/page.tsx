'use client'
import {useEffect, useState} from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import ServerPage from "@/components/Pages/ServerPage";
import ConsolePage from "@/components/Pages/ConsolePage";
import LoginPage from "@/components/Pages/LoginPage";
import {auth} from "@/utility/auth";

export type ActivePage = "server" | "console";

export default function Home() {
	const [activePage, setActivePage] = useState<ActivePage>("server");
	// null while the stored session is still being checked
	const [authed, setAuthed] = useState<boolean | null>(null);

	useEffect(() => {
		const sync = () => setAuthed(auth.token !== null);
		const unsubscribe = auth.subscribe(sync);
		if (auth.token === null) {
			setAuthed(false);
		} else {
			auth.checkSession().then((valid) => {
				// An unreachable server keeps the token, the websocket will retry
				setAuthed(valid || auth.token !== null);
			});
		}
		return unsubscribe;
	}, []);

	if (authed === null) return null;
	if (!authed) return <LoginPage/>;

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

