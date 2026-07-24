import { describe, expect, it, vi } from "vitest";
import { handleAnalyticsRequest } from "./ingest";

const validEvent = {
	name: "survey_submitted",
	schemaVersion: 1,
	occurredAt: "2026-07-24T06:00:00.000Z",
	anonymousSessionId: "7f65c010-1747-4e3f-a195-403d17e62f84",
	properties: { useCase: "food_delivery" },
};

function request(body: string, contentType = "application/json") {
	return new Request("https://samarata.test/api/events", {
		method: "POST",
		headers: { "content-type": contentType },
		body,
	});
}

describe("analytics ingestion boundary", () => {
	it("accepts and writes one validated event", async () => {
		const write = vi.fn();
		const response = await handleAnalyticsRequest(
			request(JSON.stringify(validEvent)),
			write,
		);

		expect(response.status).toBe(202);
		expect(write).toHaveBeenCalledOnce();
		expect(write).toHaveBeenCalledWith(validEvent);
	});

	it.each([
		["wrong content type", request("{}", "text/plain"), 415],
		["invalid JSON", request("{"), 400],
		[
			"unexpected data",
			request(
				JSON.stringify({
					...validEvent,
					properties: { ...validEvent.properties, amount: 50_000 },
				}),
			),
			400,
		],
		[
			"oversized body",
			request(JSON.stringify({ value: "x".repeat(5_000) })),
			413,
		],
	])("rejects %s without writing", async (_, input, status) => {
		const write = vi.fn();
		const response = await handleAnalyticsRequest(input, write);

		expect(response.status).toBe(status);
		expect(write).not.toHaveBeenCalled();
	});
});
