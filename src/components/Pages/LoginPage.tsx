"use client";
import { auth } from "@/utility/auth";
import { type FormEvent, useState } from "react";

export default function LoginPage() {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await auth.login(password);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary"
			style={{
				background:
					"radial-gradient(at 20% 20%, color-mix(in srgb, var(--color-info) 30%, transparent) 0px, transparent 60%), radial-gradient(at 80% 80%, color-mix(in srgb, var(--color-accent) 40%, transparent) 0px, transparent 60%), var(--color-bg-primary)",
			}}>
			<form
				onSubmit={submit}
				className="w-full max-w-sm p-6 rounded-lg border border-[var(--color-border-hover)] bg-[var(--color-bg-secondary)] shadow-xl flex flex-col gap-4"
			>
				<div>
					<h1 className="font-semibold text-lg font-[var(--font-heading)] text-[var(--color-info)]">
						Temper Dashboard
					</h1>
					<p className="text-xs text-[var(--color-text-muted)] mt-1">
						Enter the dashboard secret from your server config.
					</p>
				</div>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Secret"
					autoFocus
					className="px-3 py-2 rounded-md text-sm bg-bg-primary border border-[var(--color-border)] outline-none focus:border-[var(--color-info)]"
				/>
				{error && <p className="text-xs text-red-400">{error}</p>}
				<button
					type="submit"
					disabled={busy || password.length === 0}
					className="px-3 py-2 rounded-md text-sm font-medium bg-[var(--color-info)] text-white hover:brightness-110 disabled:opacity-50"
				>
					{busy ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</div>
	);
}
