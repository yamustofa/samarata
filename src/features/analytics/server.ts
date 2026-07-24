import "@tanstack/react-start/server-only";
import { env } from "cloudflare:workers";
import type { AnalyticsEvent } from "./events";

type AnalyticsBinding = {
	writeDataPoint(data: {
		blobs: string[];
		doubles: number[];
		indexes: string[];
	}): void;
};

function stringProperty(event: AnalyticsEvent, key: string) {
	const value = (event.properties as Record<string, unknown>)[key];
	return typeof value === "string" ? value : "";
}

export function writeAnalyticsEvent(event: AnalyticsEvent) {
	const binding = (env as unknown as { PRODUCT_ANALYTICS?: AnalyticsBinding })
		.PRODUCT_ANALYTICS;
	if (!binding) return;

	const returning =
		"returning" in event.properties && event.properties.returning ? 1 : 0;
	binding.writeDataPoint({
		// Fixed column meanings are documented in docs/ANALYTICS.md.
		blobs: [
			event.name,
			stringProperty(event, "locale"),
			stringProperty(event, "currency"),
			stringProperty(event, "participantCountBucket"),
			stringProperty(event, "deviceClass"),
			stringProperty(event, "shareMode"),
			stringProperty(event, "surface"),
			stringProperty(event, "variant"),
			stringProperty(event, "useCase"),
		],
		doubles: [event.schemaVersion, returning],
		indexes: [event.anonymousSessionId],
	});
}
