import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TipCard({
	buttonLabel,
	description,
	href,
	onClick,
	title,
}: {
	buttonLabel: string;
	description: string;
	href: string;
	onClick?: () => void;
	title: string;
}) {
	const [titleBeforeBrand, titleAfterBrand] = title.split("Samarata");

	return (
		<section
			aria-labelledby="tip-card-title"
			className="relative mt-10 overflow-hidden rounded-2xl border border-primary/30 bg-[linear-gradient(135deg,var(--card),color-mix(in_oklch,var(--primary),var(--card)_88%))] p-5 shadow-[var(--shadow-soft)] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-20 -right-12 size-48 rounded-full bg-primary/15 blur-3xl"
			/>
			<div className="relative max-w-xl">
				<p className="font-heading text-lg font-semibold" id="tip-card-title">
					{titleAfterBrand === undefined ? (
						title
					) : (
						<>
							{titleBeforeBrand}
							<span className="text-primary">Samarata</span>
							{titleAfterBrand}
						</>
					)}
				</p>
				<p className="mt-1.5 text-sm leading-6 text-muted-foreground">
					{description}
				</p>
			</div>
			<a
				className={cn(
					buttonVariants({ size: "lg", variant: "default" }),
					"relative mt-5 min-h-12 w-full rounded-xl px-6 shadow-[0_3px_10px_color-mix(in_oklch,var(--primary),transparent_82%)] transition-[scale,transform,background-color,color,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-[0_5px_14px_color-mix(in_oklch,var(--primary),transparent_78%)] sm:mt-0 sm:w-auto",
				)}
				href={href}
				onClick={onClick}
				rel="noreferrer"
				target="_blank"
			>
				<Heart
					aria-hidden="true"
					className="fill-current"
					data-icon="inline-start"
				/>
				{buttonLabel}
			</a>
		</section>
	);
}
