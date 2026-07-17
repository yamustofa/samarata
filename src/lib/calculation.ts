export type ParticipantInput = {
	id: string;
	name: string;
	amount: number;
};

export type ParticipantResult = ParticipantInput & {
	discount: number;
	fee: number;
	final: number;
};

export type SplitResult = {
	subtotal: number;
	discount: number;
	fee: number;
	total: number;
	participants: ParticipantResult[];
};

function allocateProportionally(total: number, weights: number[]) {
	const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
	if (total === 0 || weightTotal === 0) return weights.map(() => 0);

	const exact = weights.map((weight) => (total * weight) / weightTotal);
	const allocated = exact.map(Math.floor);
	const remainder = total - allocated.reduce((sum, amount) => sum + amount, 0);
	const ranked = exact
		.map((amount, index) => ({ index, remainder: amount - Math.floor(amount) }))
		.sort((a, b) => b.remainder - a.remainder || a.index - b.index);

	for (let index = 0; index < remainder; index += 1) {
		allocated[ranked[index].index] += 1;
	}
	return allocated;
}

export function calculateSplit(
	participants: ParticipantInput[],
	discount: number,
	fee: number,
): SplitResult {
	const subtotal = participants.reduce(
		(sum, participant) => sum + participant.amount,
		0,
	);
	const weights = participants.map((participant) => participant.amount);
	const discounts = allocateProportionally(discount, weights);
	const fees = allocateProportionally(fee, weights);
	const netAdjustment = discount - fee;
	const netAllocations = allocateProportionally(
		Math.abs(netAdjustment),
		weights,
	);
	const results = participants.map((participant, index) => ({
		...participant,
		discount: discounts[index],
		fee: fees[index],
		final:
			participant.amount -
			(netAdjustment >= 0 ? netAllocations[index] : -netAllocations[index]),
	}));

	return {
		subtotal,
		discount,
		fee,
		total: subtotal - discount + fee,
		participants: results,
	};
}
