// @vitest-environment jsdom

import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Home } from "./index";

beforeEach(() => {
	window.localStorage.clear();
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: vi.fn().mockImplementation(() => ({
			addEventListener: vi.fn(),
			matches: false,
			removeEventListener: vi.fn(),
		})),
	});
	Object.defineProperty(window, "requestAnimationFrame", {
		configurable: true,
		value: (callback: FrameRequestCallback) => {
			callback(0);
			return 1;
		},
	});
	Object.defineProperty(window, "scrollTo", {
		configurable: true,
		value: vi.fn(),
	});
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("calculator flow", () => {
	it("completes setup, participant entry, and results without login", async () => {
		render(<Home />);
		expect(
			screen.queryByRole("link", { name: "Traktir kopi susu" }),
		).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Mulai hitung" }));
		const setupHeading = await screen.findByRole("heading", {
			name: "Masukkan tagihannya",
		});
		await waitFor(() => expect(document.activeElement).toBe(setupHeading));

		fireEvent.change(screen.getByLabelText("Total diskon"), {
			target: { value: "30000" },
		});
		fireEvent.change(screen.getAllByLabelText("Nama")[0], {
			target: { value: "Budi" },
		});
		fireEvent.change(screen.getAllByLabelText("Tagihan awal")[0], {
			target: { value: "40000" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Tambah peserta" }));
		fireEvent.change(screen.getAllByLabelText("Nama")[1], {
			target: { value: "Siti" },
		});
		fireEvent.change(screen.getAllByLabelText("Tagihan awal")[1], {
			target: { value: "60000" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Hitung pembagian" }));

		const resultsHeading = await screen.findByRole("heading", {
			name: /Semua hemat/,
		});
		expect(document.activeElement).toBe(resultsHeading);
		expect(screen.getAllByText("Budi").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Siti").length).toBeGreaterThan(0);
		expect(screen.queryByText(/masuk|login/i)).toBeNull();
		const tipLink = screen.getByRole("link", { name: "Traktir kopi susu" });
		expect(tipLink.getAttribute("href")).toBe("https://saweria.co/yamustofa");
		expect(tipLink.getAttribute("target")).toBe("_blank");
		expect(tipLink.getAttribute("rel")).toBe("noreferrer");
	});

	it("shows a safe error when clipboard access fails", async () => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
		});
		render(<Home />);
		fireEvent.click(screen.getByRole("button", { name: "Mulai hitung" }));
		fireEvent.change(await screen.findByLabelText("Nama"), {
			target: { value: "Budi" },
		});
		fireEvent.change(screen.getByLabelText("Tagihan awal"), {
			target: { value: "19000" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Hitung pembagian" }));
		fireEvent.click(await screen.findByRole("button", { name: "Salin teks" }));

		await waitFor(() =>
			expect(screen.getByRole("alert").textContent).toContain(
				"Struk belum berhasil disalin",
			),
		);
	});
});
