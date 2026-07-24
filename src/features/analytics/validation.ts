import {
	type AnalyticsEvent,
	type AnalyticsEventName,
	currencies,
	deviceClasses,
	locales,
	participantCountBuckets,
	shareModes,
	useCases,
} from "./events";

type UnknownRecord = Record<string, unknown>;

const eventNames = [
	"landing_viewed",
	"calculation_started",
	"participant_added",
	"calculation_completed",
	"receipt_downloaded",
	"receipt_copied",
	"receipt_shared",
	"how_it_works_opened",
	"returning_usage",
	"tip_exposed",
	"tip_clicked",
	"survey_submitted",
] as const satisfies readonly AnalyticsEventName[];

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: UnknownRecord, keys: readonly string[]) {
	const actual = Object.keys(value).sort();
	const expected = [...keys].sort();
	return (
		actual.length === expected.length &&
		actual.every((key, index) => key === expected[index])
	);
}

function isOneOf<T extends string>(
	value: unknown,
	allowed: readonly T[],
): value is T {
	return typeof value === "string" && allowed.includes(value as T);
}

function isLocaleAndCurrency(value: UnknownRecord) {
	return (
		hasExactKeys(value, ["locale", "currency"]) &&
		isOneOf(value.locale, locales) &&
		isOneOf(value.currency, currencies)
	);
}

function hasValidProperties(name: AnalyticsEventName, value: UnknownRecord) {
	switch (name) {
		case "landing_viewed":
			return (
				hasExactKeys(value, [
					"locale",
					"currency",
					"deviceClass",
					"returning",
				]) &&
				isOneOf(value.locale, locales) &&
				isOneOf(value.currency, currencies) &&
				isOneOf(value.deviceClass, deviceClasses) &&
				typeof value.returning === "boolean"
			);
		case "calculation_started":
		case "receipt_downloaded":
		case "receipt_copied":
		case "returning_usage":
			return isLocaleAndCurrency(value);
		case "participant_added":
			return (
				hasExactKeys(value, ["participantCountBucket"]) &&
				isOneOf(value.participantCountBucket, participantCountBuckets)
			);
		case "calculation_completed":
			return (
				hasExactKeys(value, ["locale", "currency", "participantCountBucket"]) &&
				isOneOf(value.locale, locales) &&
				isOneOf(value.currency, currencies) &&
				isOneOf(value.participantCountBucket, participantCountBuckets)
			);
		case "receipt_shared":
			return (
				hasExactKeys(value, ["locale", "currency", "shareMode"]) &&
				isOneOf(value.locale, locales) &&
				isOneOf(value.currency, currencies) &&
				isOneOf(value.shareMode, shareModes)
			);
		case "how_it_works_opened":
			return (
				hasExactKeys(value, ["locale", "surface"]) &&
				isOneOf(value.locale, locales) &&
				value.surface === "hero"
			);
		case "tip_exposed":
		case "tip_clicked":
			return hasExactKeys(value, ["variant"]) && value.variant === "results_v1";
		case "survey_submitted":
			return (
				hasExactKeys(value, ["useCase"]) && isOneOf(value.useCase, useCases)
			);
	}
}

export function parseAnalyticsEvent(value: unknown): AnalyticsEvent | null {
	if (!isRecord(value)) return null;
	if (
		!hasExactKeys(value, [
			"name",
			"schemaVersion",
			"occurredAt",
			"anonymousSessionId",
			"properties",
		]) ||
		!isOneOf(value.name, eventNames) ||
		value.schemaVersion !== 1 ||
		typeof value.occurredAt !== "string" ||
		value.occurredAt.length > 40 ||
		Number.isNaN(Date.parse(value.occurredAt)) ||
		typeof value.anonymousSessionId !== "string" ||
		!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			value.anonymousSessionId,
		) ||
		!isRecord(value.properties) ||
		!hasValidProperties(value.name, value.properties)
	) {
		return null;
	}

	return value as AnalyticsEvent;
}
