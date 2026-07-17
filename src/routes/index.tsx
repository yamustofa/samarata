import ibmPlexMonoFontUrl from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2?url";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronDown,
	Clipboard,
	Download,
	Globe2,
	Menu,
	Moon,
	Plus,
	RotateCcw,
	Share2,
	Sparkles,
	Sun,
	Trash2,
	Users,
	WalletCards,
	X,
} from "lucide-react";
import {
	AnimatePresence,
	MotionConfig,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { calculateSplit, type ParticipantInput } from "@/lib/calculation";
import { cn } from "@/lib/utils";

const seoTitle = "PRORATA — Bagi Diskon dengan Adil";
const seoDescription =
	"Hitung pembagian tagihan yang adil setelah diskon, voucher, cashback, pajak, dan biaya tambahan bersama PRORATA.";
const socialImage = "/og-prorata.png";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: seoTitle },
			{ name: "description", content: seoDescription },
			{ name: "robots", content: "index, follow" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "PRORATA" },
			{ property: "og:locale", content: "id_ID" },
			{ property: "og:title", content: seoTitle },
			{ property: "og:description", content: seoDescription },
			{ property: "og:image", content: socialImage },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{
				property: "og:image:alt",
				content: "PRORATA — Split discounts fairly.",
			},
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: seoTitle },
			{ name: "twitter:description", content: seoDescription },
			{ name: "twitter:image", content: socialImage },
			{
				name: "twitter:image:alt",
				content: "PRORATA — Split discounts fairly.",
			},
		],
	}),
	component: Home,
});

type Locale = "id" | "en";
type Currency = "IDR" | "USD";
type Step = "landing" | "setup" | "results";
type Theme = "light" | "dark";

const copy = {
	id: {
		start: "Mulai hitung",
		navTagline: "Bagi diskon dengan adil.",
		eyebrow: "Bagi diskon sesuai porsi tagihan",
		title: "Hemat untuk semua. Bayar sesuai porsinya.",
		subtitle:
			"Masukkan tagihan, diskon, dan biaya lainnya. PRORATA langsung hitung berapa yang harus dibayar masing-masing.",
		benefits: [
			"Diskon proporsional",
			"Hitungan transparan",
			"Struk siap dibagikan",
		],
		setupTitle: "Masukkan tagihannya",
		setupDescription:
			"Isi diskon, biaya tambahan, dan tagihan awal masing-masing.",
		orderName: "Nama pesanan (opsional)",
		orderPlaceholder: "Makan siang Jumat 🍔",
		discount: "Total diskon",
		fee: "Ongkir & biaya layanan",
		next: "Lanjut ke peserta",
		back: "Kembali",
		participantsTitle: "Siapa saja yang ikut?",
		participantsDescription:
			"Masukkan harga pesanan masing-masing sebelum diskon dan biaya.",
		participant: "Peserta",
		name: "Nama",
		namePlaceholder: "Contoh: Budi",
		bill: "Tagihan awal",
		add: "Tambah peserta",
		remove: "Hapus peserta",
		calculate: "Hitung pembagian",
		required: "Wajib diisi.",
		positive: "Nominal harus lebih dari 0.",
		nonNegative: "Nominal tidak boleh negatif.",
		discountTooHigh:
			"Diskon tidak boleh melebihi total tagihan awal ditambah biaya.",
		resultsEyebrow: "Pembagian selesai",
		resultsTitle: "Semua hemat",
		totalPayment: "Total pembayaran",
		people: "Peserta",
		original: "Awal",
		pays: "Bayar",
		saved: "Hemat",
		receipt: "Struk ringkas",
		explanation: "Cara hitung",
		subtotal: "Total awal",
		proportional:
			"Diskon dan biaya dibagi proporsional berdasarkan tagihan awal setiap orang.",
		download: "Simpan gambar",
		copy: "Salin teks",
		share: "Bagikan",
		edit: "Ubah hitungan",
		newOrder: "Pesanan baru",
		copied: "Struk berhasil disalin.",
		downloaded: "Gambar struk berhasil dibuat.",
		shareUnavailable:
			"Fitur bagikan belum tersedia di peramban ini. Teks struk sudah disalin.",
		generated: "Dibuat dengan aplikasi PRORATA",
		currency: "Mata uang",
		language: "Bahasa",
		openMenu: "Buka menu",
		closeMenu: "Tutup menu",
		progress: "Langkah",
		lightMode: "Gunakan tema terang",
		darkMode: "Gunakan tema gelap",
	},
	en: {
		start: "Calculate the split",
		navTagline: "Split discounts fairly.",
		eyebrow: "Split discounts based on each bill’s share",
		title: "Savings for everyone. Pay your fair share.",
		subtitle:
			"Enter the bills, discounts, and additional fees. PRORATA calculates everyone’s fair share.",
		benefits: [
			"Proportional discounts",
			"Transparent math",
			"A receipt ready to share",
		],
		setupTitle: "Enter the bills",
		setupDescription:
			"Add the discount, extra fees, and everyone’s original bill.",
		orderName: "Order name (optional)",
		orderPlaceholder: "Friday lunch 🍕",
		discount: "Total discount",
		fee: "Delivery & service fee",
		next: "Continue to participants",
		back: "Back",
		participantsTitle: "Who joined the order?",
		participantsDescription:
			"Enter each person’s order total before discounts and fees.",
		participant: "Participant",
		name: "Name",
		namePlaceholder: "e.g. Alex",
		bill: "Original bill",
		add: "Add participant",
		remove: "Remove participant",
		calculate: "Calculate split",
		required: "This field is required.",
		positive: "Amount must be greater than 0.",
		nonNegative: "Amount cannot be negative.",
		discountTooHigh: "Discount cannot exceed the original total plus fees.",
		resultsEyebrow: "Split complete",
		resultsTitle: "Everyone saved",
		totalPayment: "Total payment",
		people: "Participants",
		original: "Original",
		pays: "Pays",
		saved: "Saved",
		receipt: "Receipt preview",
		explanation: "How it works",
		subtotal: "Original total",
		proportional:
			"Discount and fees are allocated proportionally from each person’s original bill.",
		download: "Save image",
		copy: "Copy text",
		share: "Share",
		edit: "Edit calculation",
		newOrder: "New order",
		copied: "Receipt copied to your clipboard.",
		downloaded: "Receipt image created.",
		shareUnavailable:
			"Sharing is not available in this browser. The receipt text was copied instead.",
		generated: "Generated by PRORATA app",
		currency: "Currency",
		language: "Language",
		openMenu: "Open menu",
		closeMenu: "Close menu",
		progress: "Step",
		lightMode: "Use light theme",
		darkMode: "Use dark theme",
	},
} as const;

function parseMoney(value: string, currency: Currency) {
	const parsed = Number(value.replace(",", "."));
	if (!Number.isFinite(parsed)) return 0;
	return Math.round(parsed * (currency === "USD" ? 100 : 1));
}

function moneyInputValue(amount: number, currency: Currency) {
	if (!amount) return "";
	return currency === "USD" ? (amount / 100).toFixed(2) : String(amount);
}

function initials(name: string) {
	return name.trim().slice(0, 2).toUpperCase() || "?";
}

function escapeXml(value: string) {
	return value.replace(
		/[<>&'"]/g,
		(character) =>
			({
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				"'": "&apos;",
				'"': "&quot;",
			})[character] ?? character,
	);
}

let ibmPlexMonoFontDataUrl: Promise<string> | undefined;

function getIbmPlexMonoFontDataUrl() {
	if (!ibmPlexMonoFontDataUrl) {
		ibmPlexMonoFontDataUrl = fetch(ibmPlexMonoFontUrl)
			.then((response) => {
				if (!response.ok) throw new Error("Unable to load receipt font");
				return response.arrayBuffer();
			})
			.then((buffer) => {
				const bytes = new Uint8Array(buffer);
				let binary = "";
				for (const byte of bytes) binary += String.fromCharCode(byte);
				return `data:font/woff2;base64,${btoa(binary)}`;
			});
	}
	return ibmPlexMonoFontDataUrl;
}

function Home() {
	const [locale, setLocale] = useState<Locale>("id");
	const [currency, setCurrency] = useState<Currency>("IDR");
	const [theme, setTheme] = useState<Theme>("light");
	const [navOpen, setNavOpen] = useState(false);
	const [step, setStep] = useState<Step>("landing");
	const [orderName, setOrderName] = useState("");
	const [discount, setDiscount] = useState(0);
	const [fee, setFee] = useState(0);
	const [participants, setParticipants] = useState<ParticipantInput[]>([
		{ id: "participant-1", name: "", amount: 0 },
	]);
	const [submitted, setSubmitted] = useState(false);
	const [notice, setNotice] = useState("");
	const nextId = useRef(2);
	const t = copy[locale];
	const formatter = useMemo(
		() =>
			new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
				style: "currency",
				currency,
				maximumFractionDigits: currency === "IDR" ? 0 : 2,
			}),
		[locale, currency],
	);
	const result = useMemo(
		() => calculateSplit(participants, discount, fee),
		[participants, discount, fee],
	);
	const netSavings = result.subtotal - result.total;

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	useEffect(() => {
		const savedTheme = window.localStorage.getItem("prorata-theme");
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const nextTheme =
			savedTheme === "light" || savedTheme === "dark"
				? savedTheme
				: mediaQuery.matches
					? "dark"
					: "light";
		setTheme(nextTheme);
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
		if (savedTheme) return;
		const followSystemTheme = (event: MediaQueryListEvent) => {
			const systemTheme = event.matches ? "dark" : "light";
			setTheme(systemTheme);
			document.documentElement.classList.toggle("dark", event.matches);
		};
		mediaQuery.addEventListener("change", followSystemTheme);
		return () => mediaQuery.removeEventListener("change", followSystemTheme);
	}, []);

	function toggleTheme() {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
		window.localStorage.setItem("prorata-theme", nextTheme);
	}

	function updateParticipant(id: string, update: Partial<ParticipantInput>) {
		setParticipants((current) =>
			current.map((participant) =>
				participant.id === id ? { ...participant, ...update } : participant,
			),
		);
	}

	function addParticipant() {
		const id = `participant-${nextId.current}`;
		nextId.current += 1;
		setParticipants((current) => [...current, { id, name: "", amount: 0 }]);
	}

	function validateParticipants() {
		setSubmitted(true);
		if (
			participants.some(
				(participant) => !participant.name.trim() || participant.amount <= 0,
			)
		)
			return;
		if (discount > result.subtotal + fee) return;
		setSubmitted(false);
		setStep("results");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function reset() {
		setOrderName("");
		setDiscount(0);
		setFee(0);
		setParticipants([{ id: "participant-1", name: "", amount: 0 }]);
		nextId.current = 2;
		setSubmitted(false);
		setNotice("");
		setStep("setup");
	}

	function receiptText() {
		const splitLabel =
			locale === "id"
				? `${result.participants.length} orang · sama rata, sama rasa`
				: `${result.participants.length} people · fair split`;
		return [
			orderName.trim() || "PRORATA",
			splitLabel,
			"#0001",
			"",
			...result.participants.map(
				(person, index) =>
					`${String(index + 1).padStart(2, "0")}  ${person.name}  ${formatter.format(person.final)}`,
			),
			"",
			`${t.totalPayment}: ${formatter.format(result.total)}`,
			"",
			t.generated,
		]
			.join("\n")
			.trim();
	}

	async function receiptBlob() {
		const embeddedReceiptFont = await getIbmPlexMonoFontDataUrl();
		await document.fonts.load('600 28px "IBM Plex Mono"');
		const generatedAt = new Date();
		const dateLocale = locale === "id" ? "id-ID" : "en-US";
		const generatedDate = new Intl.DateTimeFormat(dateLocale, {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}).format(generatedAt);
		const generatedTime = new Intl.DateTimeFormat(dateLocale, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZoneName: "short",
		}).format(generatedAt);
		const width = 720;
		const height = 390 + result.participants.length * 68;
		const paperEdgeSegments = 134;
		const paperEdgeStep = 672 / paperEdgeSegments;
		const splitLabel =
			locale === "id"
				? `${result.participants.length} orang · sama rata, sama rasa`
				: `${result.participants.length} people · fair split`;
		const edgePoints = Array.from(
			{ length: paperEdgeSegments + 1 },
			(_, index) =>
				`${24 + index * paperEdgeStep},${index % 2 === 0 ? 32 : 24}`,
		);
		const bottomEdgePoints = Array.from(
			{ length: paperEdgeSegments + 1 },
			(_, index) =>
				`${696 - index * paperEdgeStep},${index % 2 === 0 ? height - 32 : height - 24}`,
		);
		const paperPoints = [...edgePoints, ...bottomEdgePoints].join(" ");
		const rows = result.participants
			.map(
				(person, index) =>
					`<text x="64" y="${220 + index * 68}" font-size="18" fill="#766f61">${String(index + 1).padStart(2, "0")}</text><text x="108" y="${220 + index * 68}" font-size="22" fill="#25241f">${escapeXml(person.name.toUpperCase())}</text><text x="656" y="${220 + index * 68}" text-anchor="end" font-size="22" fill="#25241f">${escapeXml(formatter.format(person.final))}</text>`,
			)
			.join("");
		const totalLineY = 250 + result.participants.length * 68;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><style>@font-face{font-family:IBMPlexMono;src:url('${embeddedReceiptFont}') format('woff2');font-weight:600}text{font-family:IBMPlexMono,monospace;font-weight:600}</style><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity=".16"/></filter></defs><polygon points="${paperPoints}" fill="#fbf2d5" stroke="#d7cba9" filter="url(#shadow)"/><rect x="56" y="68" width="44" height="44" rx="5" fill="#25241f"/><text x="78" y="97" text-anchor="middle" font-size="15" fill="#fbf2d5">P/</text><text x="120" y="82" font-size="27" fill="#25241f">${escapeXml((orderName.trim() || "PRORATA").toUpperCase())}</text><text x="120" y="108" font-size="16" fill="#766f61">${escapeXml(splitLabel)}</text><text x="656" y="74" text-anchor="end" font-size="14" fill="#766f61">#0001</text><text x="656" y="94" text-anchor="end" font-size="13" fill="#766f61">${escapeXml(generatedDate)}</text><text x="656" y="114" text-anchor="end" font-size="13" fill="#766f61">${escapeXml(generatedTime)}</text><line x1="56" x2="664" y1="152" y2="152" stroke="#8f8879" stroke-opacity=".55" stroke-dasharray="7 7"/>${rows}<line x1="56" x2="664" y1="${totalLineY}" y2="${totalLineY}" stroke="#8f8879" stroke-opacity=".55" stroke-dasharray="7 7"/><text x="56" y="${totalLineY + 48}" font-size="18" fill="#766f61">${escapeXml(t.totalPayment)}</text><text x="664" y="${totalLineY + 48}" text-anchor="end" font-size="28" fill="#25241f">${escapeXml(formatter.format(result.total))}</text><text x="360" y="${height - 60}" text-anchor="middle" font-size="15" fill="#766f61">${escapeXml(t.generated)}</text></svg>`;
		const image = new Image();
		const url = URL.createObjectURL(
			new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
		);
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = reject;
			image.src = url;
		});
		const canvas = document.createElement("canvas");
		canvas.width = width * 2;
		canvas.height = height * 2;
		const context = canvas.getContext("2d");
		if (!context) throw new Error("Canvas is not available");
		const receiptContext = context;
		context.scale(2, 2);
		context.drawImage(image, 0, 0);
		URL.revokeObjectURL(url);

		context.fillStyle = "#25241f";
		context.fillRect(56, 68, 44, 44);
		context.fillStyle = "#fbf2d5";
		context.fillRect(112, 52, 400, 72);
		context.fillRect(512, 52, 152, 72);
		for (let index = 0; index < result.participants.length; index += 1) {
			context.fillRect(56, 192 + index * 68, 608, 42);
		}
		context.fillRect(56, totalLineY + 16, 608, 48);
		context.fillRect(56, height - 80, 608, 32);

		const fontFamily = '"IBM Plex Mono", monospace';
		function drawText(
			text: string,
			x: number,
			y: number,
			size: number,
			color: string,
			align: CanvasTextAlign = "left",
			maxWidth?: number,
		) {
			receiptContext.font = `600 ${size}px ${fontFamily}`;
			receiptContext.fillStyle = color;
			receiptContext.textAlign = align;
			receiptContext.fillText(text, x, y, maxWidth);
		}

		drawText("P/", 78, 97, 15, "#fbf2d5", "center");
		drawText(
			(orderName.trim() || "PRORATA").toUpperCase(),
			120,
			82,
			27,
			"#25241f",
			"left",
			390,
		);
		drawText(splitLabel, 120, 108, 16, "#766f61", "left", 390);
		drawText("#0001", 656, 74, 14, "#766f61", "right");
		drawText(generatedDate, 656, 94, 13, "#766f61", "right");
		drawText(generatedTime, 656, 114, 13, "#766f61", "right");

		result.participants.forEach((person, index) => {
			const rowY = 220 + index * 68;
			drawText(String(index + 1).padStart(2, "0"), 64, rowY, 18, "#766f61");
			drawText(
				person.name.toUpperCase(),
				108,
				rowY,
				22,
				"#25241f",
				"left",
				330,
			);
			drawText(
				formatter.format(person.final),
				656,
				rowY,
				22,
				"#25241f",
				"right",
				210,
			);
		});

		drawText(t.totalPayment, 56, totalLineY + 48, 18, "#766f61");
		drawText(
			formatter.format(result.total),
			664,
			totalLineY + 48,
			28,
			"#25241f",
			"right",
			360,
		);
		drawText(t.generated, 360, height - 60, 15, "#766f61", "center");

		return await new Promise<Blob>((resolve, reject) =>
			canvas.toBlob(
				(blob) =>
					blob ? resolve(blob) : reject(new Error("Unable to export receipt")),
				"image/png",
			),
		);
	}

	async function copyReceipt(showNotice = true) {
		await navigator.clipboard.writeText(receiptText());
		if (showNotice) setNotice(t.copied);
	}

	async function downloadReceipt() {
		const blob = await receiptBlob();
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${(orderName || "prorata").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-receipt.png`;
		link.click();
		URL.revokeObjectURL(link.href);
		setNotice(t.downloaded);
	}

	async function shareReceipt() {
		if (navigator.share) {
			const blob = await receiptBlob();
			const file = new File([blob], "prorata-receipt.png", {
				type: "image/png",
			});
			const title = orderName || "PRORATA";
			await navigator.share(
				navigator.canShare?.({ files: [file] })
					? { title, files: [file] }
					: { title, text: receiptText() },
			);
			return;
		}
		await copyReceipt(false);
		setNotice(t.shareUnavailable);
	}

	return (
		<MotionConfig reducedMotion="user">
			<main className="min-h-screen overflow-hidden bg-background text-foreground">
				<header className="relative z-20 border-b border-border bg-background">
					<div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-y-2 px-5 py-2 sm:flex-nowrap sm:px-8 sm:py-0">
						<button
							className="flex min-h-11 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
							onClick={() => {
								setNavOpen(false);
								setStep("landing");
							}}
							type="button"
						>
							<img
								alt=""
								className="size-9 rounded-md"
								draggable={false}
								height={36}
								src="/logo192.png"
								width={36}
							/>
							<span>
								<span className="block font-heading text-sm font-bold tracking-tight">
									PRORATA
								</span>
								<span className="hidden text-[11px] text-muted-foreground sm:block">
									{t.navTagline}
								</span>
							</span>
						</button>
						<Button
							aria-controls="navbar-controls"
							aria-expanded={navOpen}
							aria-label={navOpen ? t.closeMenu : t.openMenu}
							className="relative size-11 sm:hidden"
							onClick={() => setNavOpen((open) => !open)}
							size="icon"
							variant="outline"
						>
							<Menu
								aria-hidden="true"
								className={cn(
									"absolute transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
									navOpen
										? "scale-25 opacity-0 blur-xs"
										: "scale-100 opacity-100 blur-0",
								)}
							/>
							<X
								aria-hidden="true"
								className={cn(
									"absolute transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
									navOpen
										? "scale-100 opacity-100 blur-0"
										: "scale-25 opacity-0 blur-xs",
								)}
							/>
						</Button>
						<div
							className={cn(
								"hidden w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-t border-border/70 pt-2 sm:flex sm:w-auto sm:border-0 sm:pt-0",
								navOpen && "grid",
							)}
							id="navbar-controls"
						>
							<Select
								onValueChange={(value) => value && setLocale(value as Locale)}
								value={locale}
							>
								<SelectTrigger
									aria-label={t.language}
									className="h-11 w-full min-w-0 rounded-lg sm:h-10 sm:min-w-28"
								>
									<Globe2 aria-hidden="true" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="id">Indonesia</SelectItem>
										<SelectItem value="en">English</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								onValueChange={(value) =>
									value && setCurrency(value as Currency)
								}
								value={currency}
							>
								<SelectTrigger
									aria-label={t.currency}
									className="h-11 min-w-20 rounded-lg sm:h-10"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="IDR">IDR</SelectItem>
										<SelectItem value="USD">USD</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<Button
								aria-label={theme === "dark" ? t.lightMode : t.darkMode}
								className="relative size-11 sm:size-10"
								onClick={toggleTheme}
								size="icon"
								variant="outline"
							>
								<Sun
									aria-hidden="true"
									className={cn(
										"absolute transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
										theme === "dark"
											? "scale-25 opacity-0 blur-xs"
											: "scale-100 opacity-100 blur-0",
									)}
								/>
								<Moon
									aria-hidden="true"
									className={cn(
										"absolute transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
										theme === "dark"
											? "scale-100 opacity-100 blur-0"
											: "scale-25 opacity-0 blur-xs",
									)}
								/>
							</Button>
						</div>
					</div>
				</header>

				{step !== "landing" && <Progress step={step} label={t.progress} />}
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
						exit={{
							opacity: 0,
							transform: "translateY(-6px) scale(0.99)",
							transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
						}}
						initial={{ opacity: 0, transform: "translateY(10px) scale(0.99)" }}
						key={step}
						transition={{
							duration: 0.22,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						{step === "landing" && (
							<div>
								<section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:py-24">
									<div className="relative z-10 text-center lg:text-left">
										<motion.div
											animate={{ opacity: 1, transform: "translateY(0px)" }}
											initial={{ opacity: 0, transform: "translateY(8px)" }}
											transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
										>
											<p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
												{t.eyebrow}
											</p>
										</motion.div>
										<motion.h1
											animate={{ opacity: 1, transform: "translateY(0px)" }}
											className="mx-auto max-w-3xl text-balance font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-7xl lg:mx-0"
											initial={{ opacity: 0, transform: "translateY(12px)" }}
											transition={{
												delay: 0.04,
												duration: 0.24,
												ease: [0.23, 1, 0.32, 1],
											}}
										>
											{locale === "id" ? (
												<>
													<span className="headline-highlight">Hemat</span>
													{" untuk semua. Bayar sesuai "}
													<span className="headline-circle">porsinya</span>.
												</>
											) : (
												t.title
											)}
										</motion.h1>
										<motion.p
											animate={{ opacity: 1, transform: "translateY(0px)" }}
											className="mx-auto mt-7 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0"
											initial={{ opacity: 0, transform: "translateY(10px)" }}
											transition={{
												delay: 0.08,
												duration: 0.24,
												ease: [0.23, 1, 0.32, 1],
											}}
										>
											{t.subtitle}
										</motion.p>
										<Button
											className="mt-8 min-h-12 px-6 transition-transform active:scale-[0.96]"
											onClick={() => setStep("setup")}
											size="lg"
										>
											{t.start}
											<ArrowRight data-icon="inline-end" />
										</Button>
										<motion.ul
											animate="show"
											className="mx-auto mt-10 grid max-w-xl border-y border-border text-sm sm:grid-cols-3 lg:mx-0"
											initial="hidden"
											variants={{
												hidden: {},
												show: {
													transition: {
														staggerChildren: 0.04,
														delayChildren: 0.12,
													},
												},
											}}
										>
											{t.benefits.map((benefit) => (
												<motion.li
													animate={{ opacity: 1, transform: "translateY(0px)" }}
													className="flex items-center justify-center gap-2 py-3 text-muted-foreground sm:border-r sm:px-3 sm:last:border-r-0 lg:justify-start lg:first:pl-0"
													initial={{ opacity: 0, transform: "translateY(6px)" }}
													key={benefit}
													transition={{
														duration: 0.2,
														ease: [0.23, 1, 0.32, 1],
													}}
												>
													<span className="text-primary">
														<Check aria-hidden="true" className="size-3" />
													</span>
													{benefit}
												</motion.li>
											))}
										</motion.ul>
									</div>
									<HeroReceipt currency={currency} locale={locale} />
								</section>
								<footer className="border-t border-border/70 px-5 py-5 text-center font-mono text-[11px] text-muted-foreground sm:px-8">
									<span>{locale === "id" ? "Dibuat oleh " : "Made by "}</span>
									<a
										className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
										href="https://github.com/yamustofa/"
										rel="noreferrer"
										target="_blank"
									>
										yamustofa
									</a>
								</footer>
							</div>
						)}

						{step === "setup" && (
							<WorkflowShell
								description={t.setupDescription}
								icon={<WalletCards />}
								title={t.setupTitle}
								wide
							>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="order-name">{t.orderName}</FieldLabel>
										<Input
											id="order-name"
											maxLength={60}
											onChange={(event) => setOrderName(event.target.value)}
											placeholder={t.orderPlaceholder}
											value={orderName}
										/>
									</Field>
									<div className="grid gap-5 sm:grid-cols-2">
										<MoneyField
											amount={discount}
											currency={currency}
											error={discount < 0 ? t.nonNegative : ""}
											id="discount"
											label={t.discount}
											onChange={setDiscount}
										/>
										<MoneyField
											amount={fee}
											currency={currency}
											error={fee < 0 ? t.nonNegative : ""}
											id="fee"
											label={t.fee}
											onChange={setFee}
										/>
									</div>
								</FieldGroup>
								<div className="mb-5 mt-10 border-t border-border pt-8">
									<h2 className="font-heading text-xl font-semibold tracking-tight">
										{t.participantsTitle}
									</h2>
									<p className="mt-1 text-sm leading-6 text-muted-foreground">
										{t.participantsDescription}
									</p>
								</div>
								<div className="flex flex-col gap-4">
									<AnimatePresence initial={false} mode="popLayout">
										{participants.map((participant, index) => {
											const nameError = submitted && !participant.name.trim();
											const amountError = submitted && participant.amount <= 0;
											return (
												<motion.div
													key={participant.id}
													layout
													initial={{
														opacity: 0,
														transform: "translateY(8px) scale(0.98)",
													}}
													animate={{
														opacity: 1,
														transform: "translateY(0px) scale(1)",
													}}
													exit={{
														opacity: 0,
														transform: "translateY(-5px) scale(0.98)",
														transition: {
															duration: 0.14,
															ease: [0.4, 0, 1, 1],
														},
													}}
													transition={{
														duration: 0.18,
														ease: [0.23, 1, 0.32, 1],
													}}
												>
													<Card className="utility-row">
														<CardHeader>
															<div className="flex items-center gap-3">
																<Avatar size="lg">
																	<AvatarFallback className="bg-primary/15 font-semibold text-primary">
																		{initials(participant.name)}
																	</AvatarFallback>
																</Avatar>
																<div>
																	<CardTitle>
																		{participant.name ||
																			`${t.participant} ${index + 1}`}
																	</CardTitle>
																	<CardDescription>
																		{t.participant} {index + 1}
																	</CardDescription>
																</div>
															</div>
															<CardAction>
																<Button
																	aria-label={`${t.remove}: ${participant.name || index + 1}`}
																	disabled={participants.length === 1}
																	onClick={() =>
																		setParticipants((current) =>
																			current.filter(
																				(person) =>
																					person.id !== participant.id,
																			),
																		)
																	}
																	size="icon"
																	variant="ghost"
																>
																	<Trash2 aria-hidden="true" />
																</Button>
															</CardAction>
														</CardHeader>
														<CardContent>
															<FieldGroup className="sm:flex-row">
																<Field data-invalid={nameError}>
																	<FieldLabel
																		htmlFor={`${participant.id}-name`}
																	>
																		{t.name}
																	</FieldLabel>
																	<Input
																		aria-describedby={
																			nameError
																				? `${participant.id}-name-error`
																				: undefined
																		}
																		aria-invalid={nameError}
																		id={`${participant.id}-name`}
																		onChange={(event) =>
																			updateParticipant(participant.id, {
																				name: event.target.value,
																			})
																		}
																		placeholder={t.namePlaceholder}
																		value={participant.name}
																	/>
																	{nameError && (
																		<FieldError
																			id={`${participant.id}-name-error`}
																		>
																			{t.required}
																		</FieldError>
																	)}
																</Field>
																<MoneyField
																	amount={participant.amount}
																	currency={currency}
																	error={amountError ? t.positive : ""}
																	id={`${participant.id}-amount`}
																	label={t.bill}
																	onChange={(amount) =>
																		updateParticipant(participant.id, {
																			amount,
																		})
																	}
																/>
															</FieldGroup>
														</CardContent>
													</Card>
												</motion.div>
											);
										})}
									</AnimatePresence>
								</div>
								<Button
									className="mt-4 min-h-11 w-full rounded-xl border-dashed"
									onClick={addParticipant}
									variant="outline"
								>
									<Plus data-icon="inline-start" />
									{t.add}
								</Button>
								{submitted && discount > result.subtotal + fee && (
									<Alert className="mt-4 rounded-xl" variant="destructive">
										<AlertTitle>{t.discount}</AlertTitle>
										<AlertDescription>{t.discountTooHigh}</AlertDescription>
									</Alert>
								)}
								<div className="mt-8 flex items-center justify-between gap-3">
									<Button onClick={() => setStep("landing")} variant="ghost">
										<ArrowLeft data-icon="inline-start" />
										{t.back}
									</Button>
									<Button
										disabled={discount < 0 || fee < 0}
										onClick={validateParticipants}
									>
										{t.calculate}
										<ArrowRight data-icon="inline-end" />
									</Button>
								</div>
							</WorkflowShell>
						)}

						{step === "results" && (
							<section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
								<div className="border-b border-border pb-8 text-left">
									<p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
										{t.resultsEyebrow}
									</p>
									<h1 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
										{t.resultsTitle}{" "}
										<span className="text-primary">
											{formatter.format(netSavings)}
										</span>
									</h1>
								</div>
								<motion.div
									animate="show"
									className="mt-8 grid sm:grid-cols-3"
									initial="hidden"
									variants={{
										hidden: {},
										show: { transition: { staggerChildren: 0.04 } },
									}}
								>
									<SummaryCard
										icon={<WalletCards />}
										label={t.totalPayment}
										value={formatter.format(result.total)}
									/>
									<SummaryCard
										icon={<Sparkles />}
										label={t.saved}
										value={formatter.format(netSavings)}
									/>
									<SummaryCard
										icon={<Users />}
										label={t.people}
										value={String(participants.length)}
									/>
								</motion.div>
								<div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_0.9fr]">
									<div className="flex flex-col gap-3">
										{result.participants.map((person) => (
											<Card className="utility-row" key={person.id}>
												<CardHeader>
													<div className="flex items-center gap-3">
														<Avatar size="lg">
															<AvatarFallback className="bg-primary/15 font-semibold text-primary">
																{initials(person.name)}
															</AvatarFallback>
														</Avatar>
														<CardTitle>{person.name}</CardTitle>
													</div>
													<CardAction>
														<div className="text-right">
															<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
																{t.pays}
															</p>
															<p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
																{formatter.format(person.final)}
															</p>
														</div>
													</CardAction>
												</CardHeader>
												<CardContent className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4">
													<div>
														<p className="text-muted-foreground">
															{t.original}
														</p>
														<p className="mt-1 font-medium tabular-nums">
															{formatter.format(person.amount)}
														</p>
													</div>
													<div className="border-l border-border pl-4">
														<p className="text-primary">{t.saved}</p>
														<p className="mt-1 font-medium tabular-nums">
															{formatter.format(person.amount - person.final)}
														</p>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
									<div className="lg:sticky lg:top-24">
										<TiltReceipt>
											<Card className="receipt-panel">
												<CardHeader>
													<div className="flex items-center gap-3">
														<span className="grid size-9 place-items-center rounded-md bg-foreground font-mono text-xs font-bold text-background">
															P/
														</span>
														<div>
															<CardTitle>{orderName || "PRORATA"}</CardTitle>
															<CardDescription>
																{locale === "id"
																	? `${result.participants.length} orang · sama rata, sama rasa`
																	: `${result.participants.length} people · fair split`}
															</CardDescription>
														</div>
													</div>
													<CardAction>
														<span className="font-mono text-[10px] text-muted-foreground">
															#0001
														</span>
													</CardAction>
												</CardHeader>
												<CardContent>
													<Separator className="mb-4" />
													<ul className="flex flex-col gap-3">
														{result.participants.map((person, index) => (
															<li
																className="flex items-center justify-between gap-4"
																key={person.id}
															>
																<div className="flex items-center gap-3">
																	<span className="font-mono text-[10px] text-muted-foreground">
																		{String(index + 1).padStart(2, "0")}
																	</span>
																	<span className="font-mono text-xs uppercase tracking-wide">
																		{person.name}
																	</span>
																</div>
																<strong className="font-mono font-semibold tabular-nums">
																	{formatter.format(person.final)}
																</strong>
															</li>
														))}
													</ul>
													<Separator className="my-4" />
													<div className="flex items-center justify-between">
														<span className="text-muted-foreground">
															{t.totalPayment}
														</span>
														<strong className="font-mono text-lg font-semibold tabular-nums">
															{formatter.format(result.total)}
														</strong>
													</div>
													<p className="mt-6 text-center font-mono text-[10px] text-muted-foreground">
														{t.generated}
													</p>
												</CardContent>
											</Card>
										</TiltReceipt>
										<details className="group mt-4 border-y border-border py-4">
											<summary className="flex cursor-pointer list-none items-center justify-between font-medium">
												{t.explanation}
												<ChevronDown className="transition-transform group-open:rotate-180" />
											</summary>
											<div className="mt-4 flex flex-col gap-2 text-muted-foreground">
												<ReceiptLine
													label={t.subtotal}
													value={formatter.format(result.subtotal)}
												/>
												<ReceiptLine
													label={t.discount}
													value={`− ${formatter.format(discount)}`}
												/>
												<ReceiptLine
													label={t.fee}
													value={`+ ${formatter.format(fee)}`}
												/>
												<p className="mt-2 text-pretty text-xs leading-5">
													{t.proportional}
												</p>
											</div>
										</details>
									</div>
								</div>
								{notice && (
									<Alert className="mt-6 rounded-xl" role="status">
										<Check aria-hidden="true" />
										<AlertTitle>{notice}</AlertTitle>
									</Alert>
								)}
								<div className="mt-8 grid gap-3 sm:grid-cols-3">
									<Button onClick={downloadReceipt} variant="outline">
										<Download data-icon="inline-start" />
										{t.download}
									</Button>
									<Button onClick={() => copyReceipt()} variant="outline">
										<Clipboard data-icon="inline-start" />
										{t.copy}
									</Button>
									<Button onClick={shareReceipt}>
										<Share2 data-icon="inline-start" />
										{t.share}
									</Button>
								</div>
								<div className="mt-6 flex flex-wrap justify-center gap-2">
									<Button onClick={() => setStep("setup")} variant="ghost">
										<ArrowLeft data-icon="inline-start" />
										{t.edit}
									</Button>
									<Button onClick={reset} variant="ghost">
										<RotateCcw data-icon="inline-start" />
										{t.newOrder}
									</Button>
								</div>
							</section>
						)}
					</motion.div>
				</AnimatePresence>
			</main>
		</MotionConfig>
	);
}

function Progress({ step, label }: { step: Step; label: string }) {
	const current = step === "setup" ? 1 : 2;
	return (
		<div
			aria-label={`${label} ${current} / 2`}
			className="border-b border-border/60"
			role="progressbar"
			aria-valuemax={2}
			aria-valuemin={1}
			aria-valuenow={current}
		>
			<div className="mx-auto h-1 max-w-6xl bg-muted">
				<div
					className="h-full bg-primary transition-[width] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
					style={{ width: `${(current / 2) * 100}%` }}
				/>
			</div>
		</div>
	);
}

function WorkflowShell({
	children,
	description,
	icon,
	title,
	wide = false,
}: {
	children: React.ReactNode;
	description: string;
	icon: React.ReactNode;
	title: string;
	wide?: boolean;
}) {
	return (
		<section
			className={`mx-auto px-5 py-10 sm:px-8 sm:py-16 ${wide ? "max-w-3xl" : "max-w-2xl"}`}
		>
			<div className="mb-10 border-b border-border pb-6">
				<span className="mb-4 block text-primary [&>svg]:size-5">{icon}</span>
				<div className="grid gap-2 sm:grid-cols-[1fr_0.8fr] sm:items-end">
					<h1 className="text-balance font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
						{title}
					</h1>
					<p className="text-pretty text-sm leading-6 text-muted-foreground sm:text-right">
						{description}
					</p>
				</div>
			</div>
			<div>{children}</div>
		</section>
	);
}

function MoneyField({
	amount,
	currency,
	error,
	id,
	label,
	onChange,
}: {
	amount: number;
	currency: Currency;
	error: string;
	id: string;
	label: string;
	onChange: (amount: number) => void;
}) {
	const errorId = `${id}-error`;
	return (
		<Field data-invalid={Boolean(error)}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<div className="relative">
				<span
					aria-hidden="true"
					className="absolute inset-y-0 left-3 flex items-center text-xs font-medium text-muted-foreground"
				>
					{currency === "IDR" ? "Rp" : "$"}
				</span>
				<Input
					aria-describedby={error ? errorId : undefined}
					aria-invalid={Boolean(error)}
					className="pl-10 tabular-nums"
					id={id}
					inputMode="decimal"
					min="0"
					onChange={(event) =>
						onChange(parseMoney(event.target.value, currency))
					}
					placeholder={currency === "IDR" ? "0" : "0.00"}
					step={currency === "IDR" ? "1" : "0.01"}
					type="number"
					value={moneyInputValue(amount, currency)}
				/>
			</div>
			{error ? (
				<FieldError id={errorId}>{error}</FieldError>
			) : (
				<FieldDescription>
					{currency === "IDR" ? "IDR" : "USD"}
				</FieldDescription>
			)}
		</Field>
	);
}

function SummaryCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<motion.div
			className="border-y border-border py-4"
			variants={{
				hidden: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
				show: {
					opacity: 1,
					transform: "translateY(0px) scale(1)",
					transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] },
				},
			}}
		>
			<div className="flex items-center gap-3">
				<span className="text-primary [&>svg]:size-4">{icon}</span>
				<div>
					<p className="text-xs text-muted-foreground">{label}</p>
					<p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">
						{value}
					</p>
				</div>
			</div>
		</motion.div>
	);
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span>{label}</span>
			<span className="font-medium tabular-nums">{value}</span>
		</div>
	);
}

function TiltReceipt({ children }: { children: React.ReactNode }) {
	const shouldReduceMotion = useReducedMotion();
	const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
	const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
	const moveX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
	const moveY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
	const receiptTransform = useMotionTemplate`perspective(1000px) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

	function resetTilt() {
		rotateX.set(0);
		rotateY.set(0);
		moveX.set(0);
		moveY.set(0);
	}

	return (
		<motion.div
			className="will-change-transform"
			onPointerLeave={resetTilt}
			onPointerMove={(event) => {
				if (shouldReduceMotion || event.pointerType !== "mouse") return;
				const bounds = event.currentTarget.getBoundingClientRect();
				const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
				const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
				rotateX.set(pointerY * -10);
				rotateY.set(pointerX * 14);
				moveX.set(pointerX * 24);
				moveY.set(pointerY * 18);
			}}
			style={{ transform: receiptTransform }}
		>
			{children}
		</motion.div>
	);
}

function HeroReceipt({
	currency,
	locale,
}: {
	currency: Currency;
	locale: Locale;
}) {
	const formatter = useMemo(
		() =>
			new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
				style: "currency",
				currency,
				maximumFractionDigits: currency === "IDR" ? 0 : 2,
			}),
		[locale, currency],
	);
	const amounts =
		currency === "IDR" ? [16825, 21032, 15143] : [1683, 2103, 1514];
	const sample =
		locale === "id"
			? {
					title: "Ayam Geprek",
					description: "3 orang · sama rata",
					names: ["Budi", "Siti", "Andi"],
				}
			: {
					title: "Friday Pizza",
					description: "3 people · fair split",
					names: ["Alex", "Sam", "Jamie"],
				};
	return (
		<div
			aria-hidden="true"
			className="mx-auto w-full max-w-88 lg:max-w-md lg:pl-12"
		>
			<div className="printer-stage relative isolate">
				<div className="printer-machine" role="presentation">
					<div className="printer-highlight" />
					<div className="printer-light" />
					<div className="printer-bezel">
						<div className="printer-opening" />
					</div>
					<div className="printer-mouth">
						<div className="printer-mouth-shine" />
					</div>
				</div>
				<div className="printer-paper-wrap relative z-10 overflow-hidden pb-9">
					<div className="paper-feed relative mx-auto w-[76%]">
						<Card className="landing-receipt receipt-panel">
							<CardHeader>
								<div className="flex items-center gap-3">
									<span className="grid size-10 place-items-center rounded-md bg-foreground font-mono text-xs font-bold text-background">
										P/
									</span>
									<div>
										<CardTitle className="text-base">{sample.title}</CardTitle>
										<CardDescription>{sample.description}</CardDescription>
									</div>
								</div>
								<CardAction>
									<span className="font-mono text-[10px] text-muted-foreground">
										#0001
									</span>
								</CardAction>
							</CardHeader>
							<CardContent>
								<Separator className="mb-5" />
								<div className="flex flex-col gap-5">
									{sample.names.map((name, index) => (
										<div
											className="flex items-center justify-between"
											key={name}
										>
											<div className="flex items-center gap-3">
												<span className="font-mono text-[10px] text-muted-foreground">
													{String(index + 1).padStart(2, "0")}
												</span>
												<span className="font-mono text-xs uppercase tracking-wide">
													{name}
												</span>
											</div>
											<strong className="font-mono text-sm font-semibold tabular-nums">
												{formatter.format(amounts[index])}
											</strong>
										</div>
									))}
								</div>
								<Separator className="my-5" />
								<div className="flex items-end justify-between">
									<span className="text-muted-foreground">Total</span>
									<strong className="font-mono text-xl font-semibold tabular-nums">
										{formatter.format(
											amounts.reduce((sum, value) => sum + value, 0),
										)}
									</strong>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
