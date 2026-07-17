import { describe, expect, it } from "vitest";

import { calculateSplit } from "./calculation";

const participants = [
	{ id: "a", name: "A", amount: 20_000 },
	{ id: "b", name: "B", amount: 25_000 },
	{ id: "c", name: "C", amount: 18_000 },
];

describe("calculateSplit", () => {
	it("allocates discount and fee proportionally and reconciles exactly", () => {
		const result = calculateSplit(participants, 20_000, 10_000);
		expect(result.total).toBe(53_000);
		expect(
			result.participants.reduce((sum, person) => sum + person.final, 0),
		).toBe(53_000);
		expect(
			result.participants.reduce((sum, person) => sum + person.discount, 0),
		).toBe(20_000);
		expect(
			result.participants.reduce((sum, person) => sum + person.fee, 0),
		).toBe(10_000);
	});

	it("assigns rounding remainders deterministically", () => {
		const result = calculateSplit(
			[
				{ id: "a", name: "A", amount: 1 },
				{ id: "b", name: "B", amount: 1 },
				{ id: "c", name: "C", amount: 1 },
			],
			1,
			0,
		);
		expect(result.participants.map((person) => person.discount)).toEqual([
			1, 0, 0,
		]);
	});

	it("nets fees against the discount before reducing each original bill", () => {
		const result = calculateSplit(
			[
				{ id: "a", name: "Amar", amount: 3_000 },
				{ id: "b", name: "Udin", amount: 5_000 },
			],
			10_000,
			5_000,
		);

		expect(result.total).toBe(3_000);
		expect(result.participants.map((person) => person.final)).toEqual([
			1_125, 1_875,
		]);
		expect(
			result.participants.map((person) => person.amount - person.final),
		).toEqual([1_875, 3_125]);
	});
});
