import { describe, expect, it } from "vitest";
import { tipDestinationUrl, validateTipDestination } from "./tip-config";

describe("tip destination", () => {
	it("accepts the configured Saweria profile", () => {
		expect(tipDestinationUrl).toBe("https://saweria.co/yamustofa");
	});

	it.each([
		"http://saweria.co/yamustofa",
		"https://saweria.co.evil.example/yamustofa",
		"https://user:secret@saweria.co/yamustofa",
		"https://saweria.co/yamustofa?receipt=private",
		"https://saweria.co/",
		"not-a-url",
	])("fails closed for an unsafe destination: %s", (destination) => {
		expect(validateTipDestination(destination)).toBeNull();
	});
});
