import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	isAnalyticsOptedOut,
	setAnalyticsOptOut,
} from "@/features/analytics/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privasi — samarata" },
			{
				name: "description",
				content:
					"Penjelasan singkat tentang analytics dan privasi di samarata.",
			},
		],
	}),
	component: PrivacyPage,
});

export function PrivacyPage() {
	const [optedOut, setOptedOut] = useState(false);

	useEffect(() => setOptedOut(isAnalyticsOptedOut()), []);

	function updatePreference(next: boolean) {
		setAnalyticsOptOut(next);
		setOptedOut(next);
	}

	return (
		<main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8 sm:py-16">
			<article className="mx-auto max-w-2xl">
				<Link
					className={cn(buttonVariants({ variant: "ghost" }), "-ml-3 min-h-11")}
					to="/"
				>
					<ArrowLeft aria-hidden="true" data-icon="inline-start" />
					Kembali ke samarata
				</Link>
				<div className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
					<ShieldCheck aria-hidden="true" />
				</div>
				<h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight">
					Privasi, versi singkat
				</h1>
				<p className="mt-4 text-base leading-7 text-muted-foreground">
					samarata memakai analytics anonim untuk tahu fitur mana yang berguna
					dan apa yang perlu diperbaiki. Kalkulator tetap bisa dipakai kalau
					analytics gagal atau kamu memilih berhenti.
				</p>

				<section className="mt-10 border-t border-border pt-8">
					<h2 className="font-heading text-xl font-semibold">Yang dicatat</h2>
					<ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-muted-foreground">
						<li>
							aksi kategori, seperti hitung selesai, salin, simpan, atau
							bagikan;
						</li>
						<li>
							bahasa, mata uang, kelas perangkat, dan rentang jumlah peserta;
						</li>
						<li>jawaban survey pilihan tertutup, tanpa kolom teks bebas;</li>
						<li>
							ID acak per tab dan penanda lokal apakah ini kunjungan kembali.
						</li>
					</ul>
				</section>

				<section className="mt-8 border-t border-border pt-8">
					<h2 className="font-heading text-xl font-semibold">
						Yang tidak dicatat
					</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						Nama peserta, nama pesanan, nominal, diskon, biaya, isi struk,
						gambar, email, dan detail pembayaran tidak dikirim ke dataset
						produk. ID sesi tidak dibuat dari IP atau fingerprint perangkat.
					</p>
				</section>

				<section className="mt-8 border-t border-border pt-8">
					<h2 className="font-heading text-xl font-semibold">Penyimpanan</h2>
					<p className="mt-3 leading-7 text-muted-foreground">
						Tidak ada cookie analytics. ID sesi dan deduplikasi disimpan hanya
						di sessionStorage. Preferensi berhenti dan penanda kunjungan kembali
						berupa boolean di localStorage. Event produk di Cloudflare Analytics
						Engine tersimpan maksimal tiga bulan; log operasional terpisah dan
						berumur pendek sesuai paket Cloudflare.
					</p>
				</section>

				<section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
					<h2 className="font-heading text-xl font-semibold">
						Kontrol analytics
					</h2>
					<p className="mt-2 leading-7 text-muted-foreground">
						Status saat ini:{" "}
						{optedOut ? "analytics dimatikan" : "analytics aktif"}. Perubahan
						berlaku untuk event berikutnya di browser ini.
					</p>
					<Button
						className="mt-4 min-h-11"
						onClick={() => updatePreference(!optedOut)}
						variant={optedOut ? "default" : "outline"}
					>
						{optedOut ? "Aktifkan analytics" : "Matikan analytics"}
					</Button>
				</section>

				<p className="mt-8 text-xs leading-5 text-muted-foreground">
					Terakhir diperbarui: 24 Juli 2026. Cloudflare tetap memproses metadata
					jaringan standar untuk menyediakan dan mengamankan layanan sesuai
					kebijakan mereka.
				</p>
			</article>
		</main>
	);
}
