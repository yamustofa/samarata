import { Coffee } from "lucide-react";
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
	return (
		<section
			aria-labelledby="tip-card-title"
			className="mt-10 border-y border-border py-6 sm:flex sm:items-center sm:justify-between sm:gap-8"
		>
			<div className="max-w-xl">
				<p className="font-heading text-base font-semibold" id="tip-card-title">
					{title}
				</p>
				<p className="mt-1 text-sm leading-6 text-muted-foreground">
					{description}
				</p>
			</div>
			<a
				className={cn(
					buttonVariants({ size: "lg", variant: "secondary" }),
					"mt-4 min-h-11 w-full sm:mt-0 sm:w-auto",
				)}
				href={href}
				onClick={onClick}
				rel="noreferrer"
				target="_blank"
			>
				<Coffee aria-hidden="true" data-icon="inline-start" />
				{buttonLabel}
			</a>
		</section>
	);
}
