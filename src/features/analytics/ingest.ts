import type { AnalyticsEvent } from "./events";
import { parseAnalyticsEvent } from "./validation";

const maxPayloadBytes = 4_096;

export async function handleAnalyticsRequest(
	request: Request,
	write: (event: AnalyticsEvent) => void,
) {
	if (!request.headers.get("content-type")?.startsWith("application/json")) {
		return Response.json({ accepted: false }, { status: 415 });
	}

	const text = await request.text();
	if (!text || new TextEncoder().encode(text).byteLength > maxPayloadBytes) {
		return Response.json({ accepted: false }, { status: 413 });
	}

	let payload: unknown;
	try {
		payload = JSON.parse(text);
	} catch {
		return Response.json({ accepted: false }, { status: 400 });
	}

	const event = parseAnalyticsEvent(payload);
	if (!event) {
		return Response.json({ accepted: false }, { status: 400 });
	}

	write(event);
	return Response.json({ accepted: true }, { status: 202 });
}
