import { describe, expect, it } from "vitest";
import { moneyInputValue, parseMoneyInput } from "./money-input";

describe("parseMoneyInput", () => {
	it.each([
		["10000", 10_000],
		["10.000", 10_000],
		["30,000", 30_000],
		["Rp 9.997", 9_997],
		["-1.000", -1_000],
	])("parses IDR input %s as integer rupiah", (input, expected) => {
		expect(parseMoneyInput(input, "IDR")).toBe(expected);
	});

	it.each([
		["12.50", 1_250],
		["12,50", 1_250],
		["1,234", 123_400],
		["$ 1,234.56", 123_456],
		["-2.25", -225],
	])("parses USD input %s as integer cents", (input, expected) => {
		expect(parseMoneyInput(input, "USD")).toBe(expected);
	});

	it("returns zero for empty or invalid input", () => {
		expect(parseMoneyInput("", "IDR")).toBe(0);
		expect(parseMoneyInput("not money", "USD")).toBe(0);
	});
});

describe("moneyInputValue", () => {
	it("formats controlled IDR and USD values", () => {
		expect(moneyInputValue(9_997, "IDR")).toBe("9997");
		expect(moneyInputValue(1_250, "USD")).toBe("12.50");
		expect(moneyInputValue(0, "IDR")).toBe("");
	});
});
