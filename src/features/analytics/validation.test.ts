import { describe, expect, it } from "vitest";
import { participantCountBucket } from "./events";
import { parseAnalyticsEvent } from "./validation";

const baseEvent = {
	name: "calculation_completed",
	schemaVersion: 1,
	occurredAt: "2026-07-24T06:00:00.000Z",
	anonymousSessionId: "7f65c010-1747-4e3f-a195-403d17e62f84",
	properties: {
		locale: "id",
		currency: "IDR",
		participantCountBucket: "2-3",
	},
};

describe("analytics event validation", () => {
	it("accepts the closed, low-cardinality event schema", () => {
		expect(parseAnalyticsEvent(baseEvent)).toEqual(baseEvent);
	});

	it.each([
		["participant name", { ...baseEvent.properties, participantName: "Budi" }],
		["order name", { ...baseEvent.properties, orderName: "Makan siang" }],
		["raw amount", { ...baseEvent.properties, total: 100_000 }],
		["free text", { ...baseEvent.properties, feedback: "Tolong tambah fitur" }],
	])("rejects %s even when required fields are present", (_, properties) => {
		expect(parseAnalyticsEvent({ ...baseEvent, properties })).toBeNull();
	});

	it("rejects unknown enum values and envelope fields", () => {
		expect(
			parseAnalyticsEvent({
				...baseEvent,
				properties: { ...baseEvent.properties, locale: "jv" },
			}),
		).toBeNull();
		expect(parseAnalyticsEvent({ ...baseEvent, ip: "127.0.0.1" })).toBeNull();
	});

	it("buckets participant counts without exposing exact larger counts", () => {
		expect([1, 2, 3, 4, 6, 7, 99].map(participantCountBucket)).toEqual([
			"1",
			"2-3",
			"2-3",
			"4-6",
			"4-6",
			"7+",
			"7+",
		]);
	});
});
