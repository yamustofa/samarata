import ibmPlexMonoFontUrl from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2?url";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronDown,
	CircleAlert,
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TipCard } from "@/components/monetization/tip-card";
import { UseCaseSurvey } from "@/components/monetization/use-case-survey";
import { SiteFooter } from "@/components/site-footer";
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
import {
	markAndCheckReturningVisitor,
	trackAnalyticsEvent,
} from "@/features/analytics/client";
import {
	participantCountBucket,
	type UseCase,
} from "@/features/analytics/events";
import { copyText, isAbortError } from "@/lib/browser-actions";
import { calculateSplit, type ParticipantInput } from "@/lib/calculation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { moneyInputValue, parseMoneyInput } from "@/lib/money-input";
import { createReceiptText } from "@/lib/receipt-text";
import { tipDestinationUrl } from "@/lib/tip-config";
import { cn } from "@/lib/utils";

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
			"Masukkan tagihan, diskon, dan biaya lainnya. samarata langsung hitung berapa yang harus dibayar masing-masing.",
		benefits: [
			"Diskon proporsional",
			"Hitungan transparan",
			"Struk siap dibagikan",
		],
		howButton: "Gimana cara kerjanya?",
		howIntro:
			"Singkatnya, samarata bantu beresin patungan saat satu pesanan punya diskon dan biaya bersama. Nggak perlu lagi debat siapa bayar berapa atau hitung manual di kalkulator.",
		howSteps: [
			{
				title: "Masukkan total bersama",
				description: "Isi total diskon, ongkir, dan biaya layanan dari struk.",
			},
			{
				title: "Masukkan pesanan teman",
				description: "Tulis nama dan harga awal pesanan masing-masing orang.",
			},
			{
				title: "Langsung dapat bagiannya",
				description:
					"Diskon dan biaya dibagi sesuai porsi pesanan, lalu struknya bisa langsung dibagikan.",
			},
		],
		useCaseLabel: "Contoh paling relate",
		useCaseTitle: "Patungan makan siang bareng teman kantor",
		useCaseDescription:
			"Kamu pesan bareng lewat GoFood, GrabFood, atau ShopeeFood dan dapat diskon Rp30.000. Budi pesan Rp40.000, Siti Rp35.000, dan Andi Rp25.000. samarata membagi hematnya sesuai porsi: Rp12.000, Rp10.500, dan Rp7.500. Jadi tetap adil meski harga pesanan beda-beda.",
		howCta: "Oke, mulai hitung",
		closeHow: "Tutup penjelasan",
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
		totalSaved: "Total hemat",
		people: "Peserta",
		original: "Harga awal",
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
		copyFailed:
			"Struk belum berhasil disalin. Izinkan akses clipboard lalu coba lagi.",
		downloadFailed:
			"Gambar belum berhasil disimpan. Coba lagi atau gunakan Salin teks.",
		shareFailed:
			"Struk belum berhasil dibagikan. Coba lagi atau gunakan Salin teks.",
		tipTitle: "Terbantu sama samarata?",
		tipDescription:
			"Kalau hitungannya bikin patungan lebih gampang, traktir pembuatnya kopi susu, boleh ☕",
		tipButton: "Traktir kopi susu",
		surveyTitle: "Biasanya kamu pakai samarata buat apa?",
		surveyDescription:
			"Satu pilihan aja. Jawaban ini bantu menentukan fitur berikutnya, tanpa mengirim nama atau nominal.",
		surveyOptions: [
			{ label: "Pesan makanan online", value: "food_delivery" },
			{ label: "Makan langsung di restoran", value: "restaurant" },
			{ label: "Belanja rumah tangga", value: "household" },
			{ label: "Acara atau komunitas", value: "event_or_community" },
			{ label: "Keperluan lain", value: "other" },
		],
		surveySubmit: "Kirim jawaban",
		surveyDismiss: "Tutup survey",
		surveyThanks: "Makasih, jawabanmu sudah tercatat.",
		privacy: "Privasi & analytics",
		shareUnavailable:
			"Fitur bagikan belum tersedia di peramban ini. Teks struk sudah disalin.",
		generated: "Dibuat dengan aplikasi samarata",
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
			"Enter the bills, discounts, and additional fees. samarata calculates everyone’s fair share.",
		benefits: [
			"Proportional discounts",
			"Transparent math",
			"A receipt ready to share",
		],
		howButton: "How does it work?",
		howIntro:
			"In short, samarata sorts out group payments when one order has a shared discount and extra fees. No more debating who owes what or doing the math by hand.",
		howSteps: [
			{
				title: "Enter the shared totals",
				description: "Add the discount, delivery fee, and service fee.",
			},
			{
				title: "Add everyone’s order",
				description: "Enter each person’s name and original order amount.",
			},
			{
				title: "Get the fair split",
				description:
					"Discounts and fees follow each order’s share, and the receipt is ready to send.",
			},
		],
		useCaseLabel: "A familiar example",
		useCaseTitle: "A group lunch order with coworkers",
		useCaseDescription:
			"You order together through GoFood, GrabFood, or ShopeeFood and get a Rp30,000 discount. Alex orders Rp40,000, Sam Rp35,000, and Jamie Rp25,000. samarata splits the savings by order share: Rp12,000, Rp10,500, and Rp7,500. Fair, even when everyone orders something different.",
		howCta: "Got it, start splitting",
		closeHow: "Close explanation",
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
		totalSaved: "Total saved",
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
		copyFailed:
			"The receipt could not be copied. Allow clipboard access and try again.",
		downloadFailed: "The image could not be saved. Try again or use Copy text.",
		shareFailed: "The receipt could not be shared. Try again or use Copy text.",
		tipTitle: "Did samarata help?",
		tipDescription:
			"If it made splitting the bill easier, you can treat the maker to an iced coffee ☕",
		tipButton: "Buy an iced coffee",
		surveyTitle: "What do you usually use samarata for?",
		surveyDescription:
			"Pick one. This helps shape the next feature without sending names or amounts.",
		surveyOptions: [
			{ label: "Online food delivery", value: "food_delivery" },
			{ label: "Dining at a restaurant", value: "restaurant" },
			{ label: "Household shopping", value: "household" },
			{ label: "Events or communities", value: "event_or_community" },
			{ label: "Something else", value: "other" },
		],
		surveySubmit: "Send answer",
		surveyDismiss: "Dismiss survey",
		surveyThanks: "Thanks, your answer was recorded.",
		privacy: "Privacy & analytics",
		shareUnavailable:
			"Sharing is not available in this browser. The receipt text was copied instead.",
		generated: "Generated by samarata app",
		currency: "Currency",
		language: "Language",
		openMenu: "Open menu",
		closeMenu: "Close menu",
		progress: "Step",
		lightMode: "Use light theme",
		darkMode: "Use dark theme",
	},
} as const;

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

export function Home() {
	const [locale, setLocale] = useState<Locale>("id");
	const [currency, setCurrency] = useState<Currency>("IDR");
	const [theme, setTheme] = useState<Theme>("light");
	const [navOpen, setNavOpen] = useState(false);
	const [howOpen, setHowOpen] = useState(false);
	const [step, setStep] = useState<Step>("landing");
	const [orderName, setOrderName] = useState("");
	const [discount, setDiscount] = useState(0);
	const [fee, setFee] = useState(0);
	const [participants, setParticipants] = useState<ParticipantInput[]>([
		{ id: "participant-1", name: "", amount: 0 },
	]);
	const [submitted, setSubmitted] = useState(false);
	const [notice, setNotice] = useState<{
		message: string;
		tone: "error" | "success";
	} | null>(null);
	const [pendingAction, setPendingAction] = useState<
		"copy" | "download" | "share" | null
	>(null);
	const [surveyVisible, setSurveyVisible] = useState(false);
	const nextId = useRef(2);
	const completedFlow = useRef(0);
	const howCloseRef = useRef<HTMLButtonElement>(null);
	const howTriggerRef = useRef<HTMLButtonElement>(null);
	const focusWorkflowHeading = useCallback(
		(heading: HTMLHeadingElement | null) => heading?.focus(),
		[],
	);
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
		const returning = markAndCheckReturningVisitor();
		const properties = {
			locale,
			currency,
			deviceClass: window.matchMedia("(max-width: 767px)").matches
				? ("mobile" as const)
				: ("desktop" as const),
			returning,
		};
		trackAnalyticsEvent("landing_viewed", properties, { once: "landing" });
		if (returning) {
			trackAnalyticsEvent(
				"returning_usage",
				{ locale, currency },
				{ once: "returning" },
			);
		}
	}, [currency, locale]);

	useEffect(() => {
		if (step !== "results" || !isFeatureEnabled("tipCta")) return;
		trackAnalyticsEvent(
			"tip_exposed",
			{ variant: "results_v1" },
			{ once: `tip-exposed-${completedFlow.current}` },
		);
	}, [step]);

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	useEffect(() => {
		if (!howOpen) return;
		const previousOverflow = document.body.style.overflow;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setHowOpen(false);
				window.requestAnimationFrame(() => howTriggerRef.current?.focus());
			}
		};
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", closeOnEscape);
		howCloseRef.current?.focus();
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", closeOnEscape);
		};
	}, [howOpen]);

	useEffect(() => {
		const savedTheme = window.localStorage.getItem("samarata-theme");
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
		window.localStorage.setItem("samarata-theme", nextTheme);
	}

	function closeHow() {
		setHowOpen(false);
		window.requestAnimationFrame(() => howTriggerRef.current?.focus());
	}

	function startCalculation() {
		trackAnalyticsEvent(
			"calculation_started",
			{ locale, currency },
			{
				once: `calculation-started-${completedFlow.current + 1}`,
			},
		);
		setStep("setup");
	}

	function openHow() {
		trackAnalyticsEvent(
			"how_it_works_opened",
			{ locale, surface: "hero" },
			{ once: "how-it-works-hero" },
		);
		setHowOpen(true);
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
		trackAnalyticsEvent("participant_added", {
			participantCountBucket: participantCountBucket(participants.length + 1),
		});
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
		completedFlow.current += 1;
		trackAnalyticsEvent("calculation_completed", {
			locale,
			currency,
			participantCountBucket: participantCountBucket(participants.length),
		});
		setSurveyVisible(isFeatureEnabled("productSurvey"));
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
		setNotice(null);
		setSurveyVisible(false);
		startCalculation();
	}

	function receiptText() {
		const splitLabel =
			locale === "id"
				? `${result.participants.length} orang · sama rata, sama rasa`
				: `${result.participants.length} people · fair split`;
		return createReceiptText({
			formatMoney: (amount) => formatter.format(amount),
			labels: {
				generated: t.generated,
				original: t.original,
				saved: t.saved,
				totalPayment: t.totalPayment,
				totalSaved: t.totalSaved,
			},
			participants: result.participants,
			splitLabel,
			title: orderName,
			total: result.total,
			totalSaved: netSavings,
		});
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
		const rowHeight = 80;
		const height = 460 + result.participants.length * rowHeight;
		const brandLogoUrl = new URL("/logo.png", window.location.origin).href;
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
					`<text x="64" y="${206 + index * rowHeight}" font-size="18" fill="#766f61">${String(index + 1).padStart(2, "0")}</text><text x="108" y="${206 + index * rowHeight}" font-size="22" fill="#25241f">${escapeXml(person.name.toUpperCase())}</text><text x="656" y="${206 + index * rowHeight}" text-anchor="end" font-size="22" fill="#25241f">${escapeXml(formatter.format(person.final))}</text><text x="108" y="${228 + index * rowHeight}" font-size="12" fill="#9b9485">${escapeXml(`${t.original} : ${formatter.format(person.amount)}`)}</text><text x="108" y="${246 + index * rowHeight}" font-size="12" fill="#9b9485">${escapeXml(`${t.saved} : ${formatter.format(person.amount - person.final)}`)}</text>`,
			)
			.join("");
		const totalLineY = 264 + result.participants.length * rowHeight;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><style>@font-face{font-family:IBMPlexMono;src:url('${embeddedReceiptFont}') format('woff2');font-weight:600}text{font-family:IBMPlexMono,monospace;font-weight:600}</style><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity=".16"/></filter></defs><polygon points="${paperPoints}" fill="#fbf2d5" stroke="#d7cba9" filter="url(#shadow)"/><image href="${brandLogoUrl}" x="56" y="68" width="44" height="44"/><text x="120" y="82" font-size="27" fill="#25241f">${escapeXml((orderName.trim() || "samarata").toUpperCase())}</text><text x="120" y="108" font-size="16" fill="#766f61">${escapeXml(splitLabel)}</text><text x="656" y="74" text-anchor="end" font-size="14" fill="#766f61">#0001</text><text x="656" y="94" text-anchor="end" font-size="13" fill="#766f61">${escapeXml(generatedDate)}</text><text x="656" y="114" text-anchor="end" font-size="13" fill="#766f61">${escapeXml(generatedTime)}</text><line x1="56" x2="664" y1="152" y2="152" stroke="#8f8879" stroke-opacity=".55" stroke-dasharray="7 7"/>${rows}<line x1="56" x2="664" y1="${totalLineY}" y2="${totalLineY}" stroke="#8f8879" stroke-opacity=".55" stroke-dasharray="7 7"/><text x="56" y="${totalLineY + 38}" font-size="13" fill="#9b9485">${escapeXml(t.totalSaved)}</text><text x="664" y="${totalLineY + 38}" text-anchor="end" font-size="15" fill="#9b9485">${escapeXml(formatter.format(netSavings))}</text><text x="56" y="${totalLineY + 84}" font-size="18" fill="#766f61">${escapeXml(t.totalPayment)}</text><text x="664" y="${totalLineY + 84}" text-anchor="end" font-size="28" fill="#25241f">${escapeXml(formatter.format(result.total))}</text><text x="360" y="${height - 60}" text-anchor="middle" font-size="15" fill="#766f61">${escapeXml(t.generated)}</text></svg>`;
		const image = new Image();
		const url = URL.createObjectURL(
			new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
		);
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = reject;
			image.src = url;
		});
		const brandLogo = new Image();
		await new Promise<void>((resolve, reject) => {
			brandLogo.onload = () => resolve();
			brandLogo.onerror = reject;
			brandLogo.src = brandLogoUrl;
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

		context.drawImage(brandLogo, 56, 68, 44, 44);
		context.fillStyle = "#fbf2d5";
		context.fillRect(112, 52, 400, 72);
		context.fillRect(512, 52, 152, 72);
		for (let index = 0; index < result.participants.length; index += 1) {
			context.fillRect(56, 184 + index * rowHeight, 608, 64);
		}
		context.fillRect(56, totalLineY + 16, 608, 84);
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

		receiptContext.drawImage(brandLogo, 56, 68, 44, 44);
		drawText(
			(orderName.trim() || "samarata").toUpperCase(),
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
			const rowY = 206 + index * rowHeight;
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
			drawText(
				`${t.original} : ${formatter.format(person.amount)}`,
				108,
				rowY + 22,
				12,
				"#9b9485",
				"left",
				350,
			);
			drawText(
				`${t.saved} : ${formatter.format(person.amount - person.final)}`,
				108,
				rowY + 40,
				12,
				"#9b9485",
				"left",
				350,
			);
		});

		drawText(t.totalSaved, 56, totalLineY + 38, 13, "#9b9485");
		drawText(
			formatter.format(netSavings),
			664,
			totalLineY + 38,
			15,
			"#9b9485",
			"right",
			360,
		);
		drawText(t.totalPayment, 56, totalLineY + 84, 18, "#766f61");
		drawText(
			formatter.format(result.total),
			664,
			totalLineY + 84,
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

	async function runReceiptAction(
		action: "copy" | "download" | "share",
		task: () => Promise<void>,
	) {
		setNotice(null);
		setPendingAction(action);
		try {
			await task();
		} catch (error) {
			if (action === "share" && isAbortError(error)) return;
			setNotice({
				message:
					action === "copy"
						? t.copyFailed
						: action === "download"
							? t.downloadFailed
							: t.shareFailed,
				tone: "error",
			});
		} finally {
			setPendingAction(null);
		}
	}

	async function copyReceipt(showNotice = true) {
		await copyText(receiptText());
		trackAnalyticsEvent("receipt_copied", { locale, currency });
		if (showNotice) setNotice({ message: t.copied, tone: "success" });
	}

	async function downloadReceipt() {
		const blob = await receiptBlob();
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${(orderName || "samarata").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-receipt.png`;
		link.click();
		URL.revokeObjectURL(link.href);
		trackAnalyticsEvent("receipt_downloaded", { locale, currency });
		setNotice({ message: t.downloaded, tone: "success" });
	}

	async function shareReceipt() {
		if (navigator.share) {
			const title = orderName || "samarata";
			let shareData: ShareData = { title, text: receiptText() };
			let shareMode: "text" | "image" = "text";
			if (navigator.canShare) {
				try {
					const blob = await receiptBlob();
					const file = new File([blob], "samarata-receipt.png", {
						type: "image/png",
					});
					if (navigator.canShare({ files: [file] })) {
						shareData = { title, files: [file] };
						shareMode = "image";
					}
				} catch {
					// Text sharing remains useful when image export is unavailable.
				}
			}
			await navigator.share(shareData);
			trackAnalyticsEvent("receipt_shared", {
				locale,
				currency,
				shareMode,
			});
			return;
		}
		await copyReceipt(false);
		setNotice({ message: t.shareUnavailable, tone: "success" });
	}

	return (
		<MotionConfig reducedMotion="user">
			<main
				className={cn(
					"flex min-h-dvh flex-col overflow-hidden bg-background text-foreground",
					step === "landing" && "lg:h-dvh",
				)}
			>
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
								className="size-9"
								draggable={false}
								height={36}
								src="/logo.png"
								width={36}
							/>
							<span>
								<span className="block font-heading text-sm font-bold tracking-tight">
									samarata
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
				<AnimatePresence initial={false} mode="sync">
					<motion.div
						animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
						initial={{ opacity: 0, transform: "translateY(10px) scale(0.99)" }}
						className={cn(
							step === "landing" && "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col",
						)}
						key={step}
						transition={{
							duration: 0.22,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						{step === "landing" && (
							<div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
								<section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-14 px-5 py-16 sm:px-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:overflow-y-auto lg:py-6 xl:py-8">
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
										<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
											<Button
												className="min-h-12 px-6 transition-transform active:scale-[0.96]"
												onClick={startCalculation}
												size="lg"
											>
												{t.start}
												<ArrowRight data-icon="inline-end" />
											</Button>
											<Button
												className="min-h-12 px-6"
												onClick={openHow}
												ref={howTriggerRef}
												size="lg"
												variant="secondary"
											>
												<Sparkles data-icon="inline-start" />
												{t.howButton}
											</Button>
										</div>
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
								<SiteFooter locale={locale} privacyLabel={t.privacy} />
							</div>
						)}

						{step === "setup" && (
							<WorkflowShell
								description={t.setupDescription}
								headingRef={focusWorkflowHeading}
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
																	className="size-11"
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
									<Button
										className="min-h-11"
										onClick={() => setStep("landing")}
										variant="ghost"
									>
										<ArrowLeft data-icon="inline-start" />
										{t.back}
									</Button>
									<Button
										className="min-h-11"
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
									<h1
										className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.04em] outline-none sm:text-6xl"
										ref={focusWorkflowHeading}
										tabIndex={-1}
									>
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
														<img alt="" className="size-9" src="/logo.png" />
														<div>
															<CardTitle>{orderName || "samarata"}</CardTitle>
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
																className="flex items-start justify-between gap-4"
																key={person.id}
															>
																<div className="flex items-start gap-3">
																	<span className="font-mono text-[10px] text-muted-foreground">
																		{String(index + 1).padStart(2, "0")}
																	</span>
																	<div>
																		<p className="font-mono text-xs uppercase tracking-wide">
																			{person.name}
																		</p>
																		<div className="mt-1 grid grid-cols-[auto_auto_1fr] gap-x-1 font-mono text-[9px] leading-4 text-muted-foreground/70">
																			<span>{t.original}</span>
																			<span>:</span>
																			<span>
																				{formatter.format(person.amount)}
																			</span>
																			<span>{t.saved}</span>
																			<span>:</span>
																			<span>
																				{formatter.format(
																					person.amount - person.final,
																				)}
																			</span>
																		</div>
																	</div>
																</div>
																<strong className="font-mono font-semibold tabular-nums">
																	{formatter.format(person.final)}
																</strong>
															</li>
														))}
													</ul>
													<Separator className="my-4" />
													<div className="mb-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground/70">
														<span>{t.totalSaved}</span>
														<span className="tabular-nums">
															{formatter.format(netSavings)}
														</span>
													</div>
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
											<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-medium">
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
									<Alert
										className="mt-6 rounded-xl"
										role={notice.tone === "error" ? "alert" : "status"}
										variant={
											notice.tone === "error" ? "destructive" : "default"
										}
									>
										{notice.tone === "error" ? (
											<CircleAlert aria-hidden="true" />
										) : (
											<Check aria-hidden="true" />
										)}
										<AlertTitle>{notice.message}</AlertTitle>
									</Alert>
								)}
								<div className="mt-8 grid gap-3 sm:grid-cols-3">
									<Button
										className="min-h-11"
										disabled={pendingAction !== null}
										onClick={() =>
											runReceiptAction("download", downloadReceipt)
										}
										variant="outline"
									>
										<Download data-icon="inline-start" />
										{t.download}
									</Button>
									<Button
										className="min-h-11"
										disabled={pendingAction !== null}
										onClick={() => runReceiptAction("copy", copyReceipt)}
										variant="outline"
									>
										<Clipboard data-icon="inline-start" />
										{t.copy}
									</Button>
									<Button
										className="min-h-11"
										disabled={pendingAction !== null}
										onClick={() => runReceiptAction("share", shareReceipt)}
									>
										<Share2 data-icon="inline-start" />
										{t.share}
									</Button>
								</div>
								{isFeatureEnabled("tipCta") && tipDestinationUrl && (
									<TipCard
										buttonLabel={t.tipButton}
										description={t.tipDescription}
										href={tipDestinationUrl}
										onClick={() =>
											trackAnalyticsEvent("tip_clicked", {
												variant: "results_v1",
											})
										}
										title={t.tipTitle}
									/>
								)}
								{surveyVisible && isFeatureEnabled("productSurvey") && (
									<UseCaseSurvey
										description={t.surveyDescription}
										dismissLabel={t.surveyDismiss}
										onDismiss={() => setSurveyVisible(false)}
										onSubmit={(useCase: UseCase) => {
											trackAnalyticsEvent("survey_submitted", { useCase });
											setSurveyVisible(false);
											setNotice({ message: t.surveyThanks, tone: "success" });
										}}
										options={t.surveyOptions}
										submitLabel={t.surveySubmit}
										title={t.surveyTitle}
									/>
								)}
								<div className="mt-6 flex flex-wrap justify-center gap-2">
									<Button
										className="min-h-11"
										onClick={startCalculation}
										variant="ghost"
									>
										<ArrowLeft data-icon="inline-start" />
										{t.edit}
									</Button>
									<Button className="min-h-11" onClick={reset} variant="ghost">
										<RotateCcw data-icon="inline-start" />
										{t.newOrder}
									</Button>
								</div>
							</section>
						)}
					</motion.div>
				</AnimatePresence>
				<AnimatePresence>
					{howOpen && (
						<motion.div
							animate={{ opacity: 1 }}
							aria-labelledby="how-it-works-title"
							aria-describedby="how-it-works-description"
							aria-modal="true"
							className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-foreground/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
							exit={{ opacity: 0 }}
							initial={{ opacity: 0 }}
							onPointerDown={(event) => {
								if (event.target === event.currentTarget) closeHow();
							}}
							role="dialog"
							transition={{ duration: 0.16 }}
						>
							<motion.div
								animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
								className="relative max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-background p-6 shadow-2xl sm:rounded-3xl sm:p-8"
								exit={{ opacity: 0, transform: "translateY(16px) scale(0.98)" }}
								initial={{
									opacity: 0,
									transform: "translateY(20px) scale(0.98)",
								}}
								transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
							>
								<Button
									aria-label={t.closeHow}
									className="absolute top-4 right-4"
									onClick={closeHow}
									ref={howCloseRef}
									size="icon"
									variant="ghost"
								>
									<X aria-hidden="true" />
								</Button>
								<p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
									{t.howButton}
								</p>
								<h2
									className="max-w-lg text-balance font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
									id="how-it-works-title"
								>
									{locale === "id" ? (
										<>
											Jadi, <span className="text-primary">samarata</span> itu
											apa?
										</>
									) : (
										<>
											So, what is <span className="text-primary">samarata</span>
											?
										</>
									)}
								</h2>
								<p
									className="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base"
									id="how-it-works-description"
								>
									{t.howIntro}
								</p>
								<ol className="mt-6 grid gap-3 sm:grid-cols-3">
									{t.howSteps.map((item, index) => (
										<li
											className="rounded-xl border border-border bg-muted/40 p-4"
											key={item.title}
										>
											<span className="font-mono text-[10px] text-primary">
												0{index + 1}
											</span>
											<h3 className="mt-2 text-sm font-semibold">
												{item.title}
											</h3>
											<p className="mt-1 text-xs leading-5 text-muted-foreground">
												{item.description}
											</p>
										</li>
									))}
								</ol>
								<div className="mt-5 rounded-2xl border border-primary/20 bg-primary/8 p-5">
									<p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-primary">
										{t.useCaseLabel}
									</p>
									<h3 className="mt-2 font-heading text-lg font-semibold">
										{t.useCaseTitle}
									</h3>
									<p className="mt-2 text-pretty text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
										{t.useCaseDescription}
									</p>
								</div>
								<Button
									className="mt-6 w-full"
									onClick={() => {
										setHowOpen(false);
										startCalculation();
									}}
									size="lg"
								>
									{t.howCta}
									<ArrowRight data-icon="inline-end" />
								</Button>
							</motion.div>
						</motion.div>
					)}
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
	headingRef,
	icon,
	title,
	wide = false,
}: {
	children: React.ReactNode;
	description: string;
	headingRef?: React.Ref<HTMLHeadingElement>;
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
					<h1
						className="text-balance font-heading text-3xl font-semibold tracking-[-0.035em] outline-none sm:text-4xl"
						ref={headingRef}
						tabIndex={-1}
					>
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
					autoComplete="off"
					aria-describedby={error ? errorId : undefined}
					aria-invalid={Boolean(error)}
					className="pl-10 tabular-nums"
					id={id}
					inputMode="decimal"
					onChange={(event) =>
						onChange(parseMoneyInput(event.target.value, currency))
					}
					pattern="[0-9.,-]*"
					placeholder={currency === "IDR" ? "0" : "0.00"}
					type="text"
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
		<div aria-hidden="true" className="mx-auto w-full max-w-88">
			<div className="printer-stage relative isolate">
				<div className="printer-machine" role="presentation">
					<div className="printer-highlight" />
					<div className="printer-roll-cover" />
					<div className="printer-label">
						<strong>SAMARATA</strong>
						<span>THERMAL 01</span>
					</div>
					<div className="printer-controls">
						<div className="printer-light" />
						<div className="printer-feed-button" />
					</div>
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
									<img alt="" className="size-10" src="/logo.png" />
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
