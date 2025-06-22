import { HeadlinePicker } from "@client/components/headline-picker";
import { MultiSelectCopyBuilder } from "@client/components/multi-select-copy-builder";
import { CopyRevealPage } from "@client/components/copy-reveal-page";
import { trackHeadlineSelection, trackCompletion } from "@client/lib/tracking";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: Index,
});

type FunnelStep = "headline" | "copy" | "reveal";

function Index() {
	const [currentStep, setCurrentStep] = useState<FunnelStep>("headline");
	const [selectedHeadline, setSelectedHeadline] = useState<string>("");
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const handleHeadlineSelect = async (headline: string, index: number) => {
		setSelectedHeadline(headline);
		
		// Show saving toast
		toast.success("Headline saved! Now choose your statements...", {
			duration: 2000,
		});
		
		await trackHeadlineSelection(headline, index);
		
		// Move to copy builder after a brief pause
		setTimeout(() => {
			setCurrentStep("copy");
		}, 1500);
	};

	const handleCopyComplete = async (options: string[]) => {
		setSelectedOptions(options);
		await trackCompletion();
		setCurrentStep("reveal");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<div className="container mx-auto px-4 py-12">
				{currentStep === "headline" && (
					<div className="animate-fade-in">
						<HeadlinePicker onHeadlineSelect={handleHeadlineSelect} />
					</div>
				)}

				{currentStep === "copy" && (
					<div className="animate-fade-in">
						<MultiSelectCopyBuilder 
							selectedHeadline={selectedHeadline}
							onComplete={handleCopyComplete}
						/>
					</div>
				)}

				{currentStep === "reveal" && (
					<div className="animate-fade-in">
						<CopyRevealPage 
							selectedHeadline={selectedHeadline}
							selectedOptions={selectedOptions}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Index;
