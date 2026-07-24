import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UseCase } from "@/features/analytics/events";

type SurveyOption = { label: string; value: UseCase };

export function UseCaseSurvey({
	description,
	dismissLabel,
	onDismiss,
	onSubmit,
	options,
	submitLabel,
	title,
}: {
	description: string;
	dismissLabel: string;
	onDismiss: () => void;
	onSubmit: (value: UseCase) => void;
	options: readonly SurveyOption[];
	submitLabel: string;
	title: string;
}) {
	const [selected, setSelected] = useState<UseCase | null>(null);

	return (
		<section
			aria-labelledby="use-case-survey-title"
			className="relative mt-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
		>
			<Button
				aria-label={dismissLabel}
				className="absolute top-3 right-3 size-11"
				onClick={onDismiss}
				size="icon"
				variant="ghost"
			>
				<X aria-hidden="true" />
			</Button>
			<div className="pr-10">
				<h2
					className="font-heading text-base font-semibold"
					id="use-case-survey-title"
				>
					{title}
				</h2>
				<p className="mt-1 text-sm leading-6 text-muted-foreground">
					{description}
				</p>
			</div>
			<fieldset className="mt-5 grid gap-2 sm:grid-cols-2">
				<legend className="sr-only">{title}</legend>
				{options.map((option) => (
					<label
						className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm transition-colors has-checked:border-primary has-checked:bg-primary/5"
						key={option.value}
					>
						<input
							checked={selected === option.value}
							className="size-4 accent-primary"
							name="samarata-use-case"
							onChange={() => setSelected(option.value)}
							type="radio"
							value={option.value}
						/>
						{option.label}
					</label>
				))}
			</fieldset>
			<Button
				className="mt-4 min-h-11 w-full sm:w-auto"
				disabled={!selected}
				onClick={() => selected && onSubmit(selected)}
			>
				{submitLabel}
			</Button>
		</section>
	);
}
