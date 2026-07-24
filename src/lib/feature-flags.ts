export const featureFlagNames = [
	"tipCta",
	"productSurvey",
	"samarataPlus",
	"sponsoredOffer",
	"paymentLinks",
	"officePlan",
	"publicApi",
] as const;

export type FeatureFlagName = (typeof featureFlagNames)[number];
export type FeatureFlags = Readonly<Record<FeatureFlagName, boolean>>;

export const featureFlags = Object.freeze({
	tipCta: true,
	productSurvey: false,
	samarataPlus: false,
	sponsoredOffer: false,
	paymentLinks: false,
	officePlan: false,
	publicApi: false,
} satisfies FeatureFlags);

export function isFeatureEnabled(flag: FeatureFlagName) {
	return featureFlags[flag];
}
