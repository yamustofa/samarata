export const locales = ["id", "en"] as const;
export const currencies = ["IDR", "USD"] as const;
export const participantCountBuckets = ["1", "2-3", "4-6", "7+"] as const;
export const deviceClasses = ["mobile", "desktop"] as const;
export const shareModes = ["image", "text"] as const;
export const useCases = [
	"food_delivery",
	"restaurant",
	"household",
	"event_or_community",
	"other",
] as const;

export type AnalyticsLocale = (typeof locales)[number];
export type AnalyticsCurrency = (typeof currencies)[number];
export type ParticipantCountBucket = (typeof participantCountBuckets)[number];
export type DeviceClass = (typeof deviceClasses)[number];
export type ShareMode = (typeof shareModes)[number];
export type UseCase = (typeof useCases)[number];

type LocaleAndCurrency = {
	locale: AnalyticsLocale;
	currency: AnalyticsCurrency;
};

export type AnalyticsEventProperties = {
	landing_viewed: LocaleAndCurrency & {
		deviceClass: DeviceClass;
		returning: boolean;
	};
	calculation_started: LocaleAndCurrency;
	participant_added: { participantCountBucket: ParticipantCountBucket };
	calculation_completed: LocaleAndCurrency & {
		participantCountBucket: ParticipantCountBucket;
	};
	receipt_downloaded: LocaleAndCurrency;
	receipt_copied: LocaleAndCurrency;
	receipt_shared: LocaleAndCurrency & { shareMode: ShareMode };
	how_it_works_opened: {
		locale: AnalyticsLocale;
		surface: "hero";
	};
	returning_usage: LocaleAndCurrency;
	tip_exposed: { variant: "results_v1" };
	tip_clicked: { variant: "results_v1" };
	survey_submitted: { useCase: UseCase };
};

export type AnalyticsEventName = keyof AnalyticsEventProperties;

export type AnalyticsEvent<
	TName extends AnalyticsEventName = AnalyticsEventName,
> = TName extends AnalyticsEventName
	? {
			name: TName;
			schemaVersion: 1;
			occurredAt: string;
			anonymousSessionId: string;
			properties: AnalyticsEventProperties[TName];
		}
	: never;

export function participantCountBucket(count: number): ParticipantCountBucket {
	if (count <= 1) return "1";
	if (count <= 3) return "2-3";
	if (count <= 6) return "4-6";
	return "7+";
}
