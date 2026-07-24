// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText, isAbortError } from "./browser-actions";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("copyText", () => {
	it("uses the asynchronous clipboard API when available", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText },
		});

		await copyText("receipt");

		expect(writeText).toHaveBeenCalledWith("receipt");
	});

	it("falls back to the legacy copy command", async () => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: undefined,
		});
		const execCommand = vi.fn().mockReturnValue(true);
		Object.defineProperty(document, "execCommand", {
			configurable: true,
			value: execCommand,
		});

		await copyText("receipt");

		expect(execCommand).toHaveBeenCalledWith("copy");
		expect(document.querySelector("textarea")).toBeNull();
	});

	it("reports an unavailable clipboard fallback", async () => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: undefined,
		});
		Object.defineProperty(document, "execCommand", {
			configurable: true,
			value: vi.fn().mockReturnValue(false),
		});

		await expect(copyText("receipt")).rejects.toThrow(
			"Clipboard copy is unavailable",
		);
		expect(document.querySelector("textarea")).toBeNull();
	});
});

describe("isAbortError", () => {
	it("recognizes a cancelled browser share", () => {
		expect(isAbortError(new DOMException("Cancelled", "AbortError"))).toBe(
			true,
		);
		expect(isAbortError(new Error("Failed"))).toBe(false);
	});
});
