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

	it("enables only the launched tip CTA", () => {
		expect(isFeatureEnabled("tipCta")).toBe(true);
		for (const flag of featureFlagNames.filter((name) => name !== "tipCta")) {
			expect(isFeatureEnabled(flag)).toBe(false);
		}
	});

	it("cannot be mutated at runtime", () => {
		expect(Object.isFrozen(featureFlags)).toBe(true);
	});
});
