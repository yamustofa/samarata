const allowedTipHosts = new Set(["saweria.co"]);

export function validateTipDestination(value: string) {
	try {
		const url = new URL(value);
		if (
			url.protocol !== "https:" ||
			!allowedTipHosts.has(url.hostname) ||
			url.username ||
			url.password ||
			url.search ||
			url.hash ||
			url.pathname === "/"
		) {
			return null;
		}
		return url.href;
	} catch {
		return null;
	}
}

export const tipDestinationUrl = validateTipDestination(
	"https://saweria.co/yamustofa",
);
