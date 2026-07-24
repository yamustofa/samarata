import type { ParticipantResult } from "./calculation";

type ReceiptTextParticipant = Pick<
	ParticipantResult,
	"amount" | "final" | "name"
>;

export type ReceiptTextLabels = {
	generated: string;
	original: string;
	saved: string;
	totalPayment: string;
	totalSaved: string;
};

export type CreateReceiptTextOptions = {
	formatMoney: (amount: number) => string;
	labels: ReceiptTextLabels;
	participants: ReceiptTextParticipant[];
	receiptNumber?: string;
	splitLabel: string;
	title: string;
	total: number;
	totalSaved: number;
};

export function createReceiptText({
	formatMoney,
	labels,
	participants,
	receiptNumber = "#0001",
	splitLabel,
	title,
	total,
	totalSaved,
}: CreateReceiptTextOptions) {
	return [
		title.trim() || "samarata",
		splitLabel,
		receiptNumber,
		"",
		...participants.flatMap((participant, index) => [
			`${String(index + 1).padStart(2, "0")}  ${participant.name}  ${formatMoney(participant.final)}`,
			`    ${labels.original} : ${formatMoney(participant.amount)}`,
			`    ${labels.saved} : ${formatMoney(participant.amount - participant.final)}`,
		]),
		"",
		`${labels.totalSaved}: ${formatMoney(totalSaved)}`,
		`${labels.totalPayment}: ${formatMoney(total)}`,
		"",
		labels.generated,
	]
		.join("\n")
		.trim();
}
