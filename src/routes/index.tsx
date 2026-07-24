import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/features/calculator/home-page";

const seoTitle = "samarata — Bagi Diskon dengan Adil";
const seoDescription =
	"Hitung pembagian tagihan yang adil setelah diskon, voucher, cashback, pajak, dan biaya tambahan bersama samarata.";
const siteUrl = "https://samarata.yamustofa.workers.dev";
const socialImage = `${siteUrl}/og-samarata.png`;

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: seoTitle },
			{ name: "description", content: seoDescription },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "samarata" },
			{ property: "og:locale", content: "id_ID" },
			{ property: "og:url", content: siteUrl },
			{ property: "og:title", content: seoTitle },
			{ property: "og:description", content: seoDescription },
			{ property: "og:image", content: socialImage },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{
				property: "og:image:alt",
				content: "samarata — Split discounts fairly.",
			},
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: seoTitle },
			{ name: "twitter:description", content: seoDescription },
			{ name: "twitter:image", content: socialImage },
			{
				name: "twitter:image:alt",
				content: "samarata — Split discounts fairly.",
			},
		],
		links: [{ rel: "canonical", href: siteUrl }],
	}),
	component: HomeRoute,
});

function HomeRoute() {
	return <Home />;
}
