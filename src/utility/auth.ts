import { sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

const preferredServerPort: string = "9000";
const TOKEN_KEY = "temper_session";

export function getServerAddress(): string {
	const addressPort =
		preferredServerPort ||
		new URLSearchParams(window.location.search).get("ws_port") ||
		window.location.port;
	const addressIp = window.location.hostname;
	return addressPort ? `${addressIp}:${addressPort}` : addressIp;
}

/** SHA-512 as lowercase hex. SubtleCrypto only exists in secure contexts, so fall back to noble. */
async function hashPassword(password: string): Promise<string> {
	if (typeof crypto !== "undefined" && crypto.subtle) {
		const digest = await crypto.subtle.digest(
			"SHA-512",
			new TextEncoder().encode(password),
		);
		return Array.from(new Uint8Array(digest), (b) =>
			b.toString(16).padStart(2, "0"),
		).join("");
	}
	return bytesToHex(sha512(new TextEncoder().encode(password)));
}

type AuthListener = () => void;

class AuthStore {
	private listeners = new Set<AuthListener>();

	get token(): string | null {
		if (typeof window === "undefined") return null;
		return window.localStorage.getItem(TOKEN_KEY);
	}

	subscribe(listener: AuthListener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private notify() {
		this.listeners.forEach((listener) => listener());
	}

	private apiUrl(path: string) {
		return `${window.location.protocol}//${getServerAddress()}${path}`;
	}

	/** Checks that the stored token is still accepted by the server. */
	async checkSession(): Promise<boolean> {
		const token = this.token;
		if (!token) return false;
		try {
			const res = await fetch(this.apiUrl("/api/session"), {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.status === 401) this.clear();
			return res.ok;
		} catch {
			// Server unreachable, keep the token and let the caller retry
			return false;
		}
	}

	async login(password: string): Promise<void> {
		const res = await fetch(this.apiUrl("/api/login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ hash: await hashPassword(password) }),
		});
		if (res.status === 401) throw new Error("Incorrect password");
		if (res.status === 429)
			throw new Error("Too many failed attempts, try again later");
		if (!res.ok) throw new Error(`Login failed (${res.status})`);

		const { token } = await res.json();
		window.localStorage.setItem(TOKEN_KEY, token);
		this.notify();
	}

	async logout() {
		const token = this.token;
		this.clear();
		if (!token) return;
		try {
			await fetch(this.apiUrl("/api/logout"), {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch {
			// Already logged out locally
		}
	}

	/** Forgets the token, e.g. after the server rejected it. */
	clear() {
		window.localStorage.removeItem(TOKEN_KEY);
		this.notify();
	}
}

export const auth = new AuthStore();
