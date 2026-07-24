import { describe, expect, it } from "vitest";

import {
	featureFlagNames,
	featureFlags,
	isFeatureEnabled,
} from "./feature-flags";

describe("feature flags", () => {
	it("defines every planned monetization flag", () => {
		expect(Object.keys(featureFlags).sort()).toEqual(
			[...featureFlagNames].sort(),
		);
	});

	it("fails closed for every feature by default", () => {
		for (const flag of featureFlagNames) {
			expect(isFeatureEnabled(flag)).toBe(false);
		}
	});

	it("cannot be mutated at runtime", () => {
		expect(Object.isFrozen(featureFlags)).toBe(true);
	});
});
