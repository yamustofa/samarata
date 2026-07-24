import { createFileRoute } from "@tanstack/react-router";
import { handleAnalyticsRequest } from "@/features/analytics/ingest";
import { writeAnalyticsEvent } from "@/features/analytics/server";

export const Route = createFileRoute("/api/events")({
	server: {
		handlers: {
			POST: ({ request }) =>
				handleAnalyticsRequest(request, writeAnalyticsEvent),
		},
	},
});
