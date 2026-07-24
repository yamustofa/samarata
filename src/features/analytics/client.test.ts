// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsOptOut, trackAnalyticsEvent } from "./client";

beforeEach(() => {
	window.localStorage.clear();
	window.sessionStorage.clear();
	vi.restoreAllMocks();
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue(new Response(null, { status: 202 })),
	);
});

describe("analytics client", () => {
	it("emits only the typed envelope and deduplicates once keys", () => {
		trackAnalyticsEvent(
			"calculation_completed",
			{
				locale: "id",
				currency: "IDR",
				participantCountBucket: "2-3",
			},
			{ once: "completed-1" },
		);
		trackAnalyticsEvent(
			"calculation_completed",
			{
				locale: "id",
				currency: "IDR",
				participantCountBucket: "2-3",
			},
			{ once: "completed-1" },
		);

		expect(fetch).toHaveBeenCalledOnce();
		const [, options] = vi.mocked(fetch).mock.calls[0];
		const payload = JSON.parse(String(options?.body));
		expect(payload).toMatchObject({
			name: "calculation_completed",
			schemaVersion: 1,
			properties: {
				locale: "id",
				currency: "IDR",
				participantCountBucket: "2-3",
			},
		});
		expect(JSON.stringify(payload.properties)).not.toMatch(
			/participantName|orderName|amount|discount|fee|total|receipt/i,
		);
	});

	it("becomes a no-op immediately after opt-out", () => {
		setAnalyticsOptOut(true);
		trackAnalyticsEvent("tip_clicked", { variant: "results_v1" });

		expect(fetch).not.toHaveBeenCalled();
		expect(window.sessionStorage.length).toBe(0);
	});
});
