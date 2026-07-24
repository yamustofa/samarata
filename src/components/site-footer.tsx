import { Link } from "@tanstack/react-router";

export function SiteFooter({
	locale,
	privacyLabel,
}: {
	locale: "id" | "en";
	privacyLabel: string;
}) {
	return (
		<footer className="shrink-0 border-t border-border/70 font-mono text-[11px] text-muted-foreground">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 sm:px-8">
				<nav
					aria-label={
						locale === "id"
							? "Media sosial dan privasi"
							: "Social media and privacy"
					}
					className="flex flex-wrap items-center gap-x-3"
				>
					<a
						className="inline-flex min-h-11 items-center transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
						href="https://www.threads.com/@mustavibe.dev"
						rel="noreferrer"
						target="_blank"
					>
						Threads
					</a>
					<a
						className="inline-flex min-h-11 items-center transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
						href="https://x.com/mustavibe"
						rel="noreferrer"
						target="_blank"
					>
						X
					</a>
					<span aria-hidden="true" className="text-border">
						•
					</span>
					<Link
						className="inline-flex min-h-11 items-center transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
						to="/privacy"
					>
						{privacyLabel}
					</Link>
				</nav>
				<div className="ml-auto text-right">
					<span>{locale === "id" ? "Dibuat oleh " : "Made by "}</span>
					<a
						className="inline-flex min-h-11 items-center font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
						href="https://github.com/yamustofa/"
						rel="noreferrer"
						target="_blank"
					>
						yamustofa
					</a>
				</div>
			</div>
		</footer>
	);
}
