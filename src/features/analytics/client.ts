import type { AnalyticsEventName, AnalyticsEventProperties } from "./events";

const optOutKey = "samarata-analytics-opt-out";
const sessionIdKey = "samarata-analytics-session-v1";
const dedupeKey = "samarata-analytics-once-v1";
const visitedKey = "samarata-has-visited";
const returningKey = "samarata-returning-session-v1";

function storageAvailable() {
	return typeof window !== "undefined";
}

function getSessionId() {
	if (!storageAvailable() || !window.crypto?.randomUUID) return null;
	try {
		const existing = window.sessionStorage.getItem(sessionIdKey);
		if (existing) return existing;
		const created = window.crypto.randomUUID();
		window.sessionStorage.setItem(sessionIdKey, created);
		return created;
	} catch {
		return null;
	}
}

function claimOnce(key: string) {
	try {
		const claimed = JSON.parse(
			window.sessionStorage.getItem(dedupeKey) ?? "[]",
		) as unknown;
		const keys = Array.isArray(claimed)
			? claimed.filter((value): value is string => typeof value === "string")
			: [];
		if (keys.includes(key)) return false;
		window.sessionStorage.setItem(dedupeKey, JSON.stringify([...keys, key]));
		return true;
	} catch {
		return true;
	}
}

export function isAnalyticsOptedOut() {
	if (!storageAvailable()) return false;
	try {
		return window.localStorage.getItem(optOutKey) === "true";
	} catch {
		return false;
	}
}

export function setAnalyticsOptOut(optedOut: boolean) {
	if (!storageAvailable()) return;
	try {
		if (optedOut) {
			window.localStorage.setItem(optOutKey, "true");
			window.sessionStorage.removeItem(sessionIdKey);
			window.sessionStorage.removeItem(dedupeKey);
		} else {
			window.localStorage.removeItem(optOutKey);
		}
	} catch {
		// Analytics preferences must never interrupt the calculator.
	}
}

export function markAndCheckReturningVisitor() {
	if (!storageAvailable()) return false;
	try {
		const sessionValue = window.sessionStorage.getItem(returningKey);
		if (sessionValue) return sessionValue === "true";
		const returning = window.localStorage.getItem(visitedKey) === "true";
		window.localStorage.setItem(visitedKey, "true");
		window.sessionStorage.setItem(returningKey, String(returning));
		return returning;
	} catch {
		return false;
	}
}

export function trackAnalyticsEvent<TName extends AnalyticsEventName>(
	name: TName,
	properties: AnalyticsEventProperties[TName],
	options: { once?: string } = {},
) {
	if (!storageAvailable() || isAnalyticsOptedOut()) return;
	if (options.once && !claimOnce(options.once)) return;
	const anonymousSessionId = getSessionId();
	if (!anonymousSessionId) return;

	try {
		void fetch("/api/events", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name,
				schemaVersion: 1,
				occurredAt: new Date().toISOString(),
				anonymousSessionId,
				properties,
			}),
			keepalive: true,
		}).catch(() => undefined);
	} catch {
		// Product analytics is intentionally best-effort.
	}
}
