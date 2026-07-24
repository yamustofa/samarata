export type MoneyInputCurrency = "IDR" | "USD";

export function parseMoneyInput(value: string, currency: MoneyInputCurrency) {
	const trimmed = value.trim();
	if (!trimmed) return 0;

	const sign = trimmed.startsWith("-") ? -1 : 1;
	const unsigned = trimmed.replace(/[^\d.,]/g, "");
	if (!unsigned) return 0;

	if (currency === "IDR") {
		const digits = unsigned.replace(/\D/g, "");
		return sign * Number(digits || 0);
	}

	const dotCount = unsigned.match(/\./g)?.length ?? 0;
	const commaCount = unsigned.match(/,/g)?.length ?? 0;
	const commaGroups = unsigned.split(",");
	const commaIsGrouping =
		dotCount === 0 &&
		commaCount > 0 &&
		commaGroups.slice(1).every((group) => group.length === 3);
	const dotGroups = unsigned.split(".");
	const dotIsGrouping =
		commaCount === 0 &&
		dotCount > 1 &&
		dotGroups.slice(1).every((group) => group.length === 3);
	const decimalIndex =
		commaIsGrouping || dotIsGrouping
			? -1
			: Math.max(unsigned.lastIndexOf("."), unsigned.lastIndexOf(","));
	const whole = (
		decimalIndex >= 0 ? unsigned.slice(0, decimalIndex) : unsigned
	).replace(/\D/g, "");
	const fraction =
		decimalIndex >= 0
			? unsigned.slice(decimalIndex + 1).replace(/\D/g, "")
			: "";
	const normalized = fraction
		? `${whole || "0"}.${fraction}`
		: unsigned.replace(/\D/g, "");
	const parsed = Number(normalized);
	return Number.isFinite(parsed) ? sign * Math.round(parsed * 100) : 0;
}

export function moneyInputValue(amount: number, currency: MoneyInputCurrency) {
	if (!amount) return "";
	return currency === "USD" ? (amount / 100).toFixed(2) : String(amount);
}
