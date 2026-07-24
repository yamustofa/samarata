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

	it("keeps every original amount when discount and fee are zero", () => {
		const result = calculateSplit(participants, 0, 0);

		expect(result.total).toBe(result.subtotal);
		expect(result.participants.map((person) => person.final)).toEqual(
			participants.map((person) => person.amount),
		);
		expect(result.participants.map((person) => person.discount)).toEqual([
			0, 0, 0,
		]);
		expect(result.participants.map((person) => person.fee)).toEqual([0, 0, 0]);
	});

	it("adds a proportional adjustment when fees exceed the discount", () => {
		const result = calculateSplit(
			[
				{ id: "a", name: "A", amount: 4_000 },
				{ id: "b", name: "B", amount: 6_000 },
			],
			1_000,
			3_000,
		);

		expect(result.total).toBe(12_000);
		expect(result.participants.map((person) => person.final)).toEqual([
			4_800, 7_200,
		]);
		expect(
			result.participants.reduce((sum, person) => sum + person.final, 0),
		).toBe(result.total);
	});

	it("reconciles fractional USD cents using integer minor units", () => {
		const result = calculateSplit(
			[
				{ id: "a", name: "A", amount: 1_001 },
				{ id: "b", name: "B", amount: 999 },
			],
			333,
			77,
		);

		expect(result.total).toBe(1_744);
		expect(result.participants.map((person) => person.final)).toEqual([
			873, 871,
		]);
		expect(
			result.participants.reduce((sum, person) => sum + person.final, 0),
		).toBe(result.total);
	});

	it("reconciles exactly for a larger participant group", () => {
		const largeGroup = Array.from({ length: 25 }, (_, index) => ({
			id: `participant-${index + 1}`,
			name: `Participant ${index + 1}`,
			amount: 10_000 + index * 1_337,
		}));
		const result = calculateSplit(largeGroup, 87_654, 23_456);

		expect(
			result.participants.reduce((sum, person) => sum + person.discount, 0),
		).toBe(result.discount);
		expect(
			result.participants.reduce((sum, person) => sum + person.fee, 0),
		).toBe(result.fee);
		expect(
			result.participants.reduce((sum, person) => sum + person.final, 0),
		).toBe(result.total);
	});
});
