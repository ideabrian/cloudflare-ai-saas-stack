import { useState, useEffect } from "react";
import { Button } from "@client/components/ui/button";
import { Card, CardContent } from "@client/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@client/components/ui/dialog";
import { Play, Pause, Volume2, Copy, Check } from "lucide-react";

interface CopyRevealPageProps {
	selectedHeadline: string;
	selectedOptions: string[];
}

export function CopyRevealPage({ selectedHeadline, selectedOptions }: CopyRevealPageProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [copied, setCopied] = useState(false);
	const [showNextStep, setShowNextStep] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const [salesLetter, setSalesLetter] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(true);

	// Generate the complete sales letter when component mounts
	useEffect(() => {
		const generateSalesLetter = async () => {
			try {
				// For now, create a placeholder - we'll implement the AI call next
				const placeholder = `You chose "${selectedHeadline}" because something in you said 'Yes.' I get it.

The statements you selected tell a story: ${selectedOptions.map(id => {
					// Convert option IDs back to readable text
					const optionTexts = {
						"opening-1": "you're tired of building alone",
						"opening-2": "you're looking for your people", 
						"opening-3": "you're done with the solo act",
						"problem-1": "you're building in a vacuum",
						"problem-2": "you wonder 'what if' late at night",
						"problem-3": "others are already ahead of you",
						"solution-1": "you need people who think like you",
						"solution-2": "you want people in your corner",
						"solution-3": "you're ready to build, not just talk",
						"social-1": "you know great projects aren't solo",
						"social-2": "people like you are already here",
						"social-3": "you need to find the right people",
						"urgency-1": "you're losing momentum alone",
						"urgency-2": "others are connecting without you",
						"urgency-3": "you should build relationships now"
					};
					return optionTexts[id as keyof typeof optionTexts] || id;
				}).join(", ")}.

This isn't just about networking. This is about finding your people - the ones who understand why you obsess over the details, why you lose sleep over product decisions, why you believe what you're building matters.

Hey.Builders is where people who think like you are already gathering. Not to collect connections, but to actually build together.

The question isn't whether you can afford to join. It's whether you can afford not to.`;

				setSalesLetter(placeholder);
			} catch (error) {
				console.error("Failed to generate sales letter:", error);
				setSalesLetter("Failed to generate your personalized sales letter. Please try again.");
			} finally {
				setIsGenerating(false);
			}
		};

		generateSalesLetter();
	}, [selectedHeadline, selectedOptions]);

	const handlePlayAudio = () => {
		if ('speechSynthesis' in window) {
			if (isPlaying) {
				speechSynthesis.cancel();
				setIsPlaying(false);
			} else {
				const fullText = `${selectedHeadline}. ${salesLetter}`;
				const utterance = new SpeechSynthesisUtterance(fullText);
				utterance.rate = 0.9;
				utterance.pitch = 1;
				utterance.volume = 0.8;
				
				utterance.onend = () => setIsPlaying(false);
				utterance.onerror = () => setIsPlaying(false);
				
				speechSynthesis.speak(utterance);
				setIsPlaying(true);
			}
		}
	};

	const handleCopyText = async () => {
		const fullText = `${selectedHeadline}\n\n${salesLetter}`;
		
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(fullText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const revealNextStep = () => {
		setShowNextStep(true);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Celebration Header */}
			<div className="text-center space-y-4">
				<div className="text-6xl mb-4">🎉</div>
				<h1 className="text-3xl md:text-5xl font-black text-green-600">
					Here's what you just built.
				</h1>
				<p className="text-xl text-muted-foreground">
					Your {selectedOptions.length} choices just became a complete, personalized sales letter crafted in Joanna Wiebe's style.
				</p>
			</div>

			{/* The Complete Sales Letter */}
			<Card className="relative">
				<CardContent className="p-8 md:p-12">
					{isGenerating ? (
						<div className="text-center space-y-4">
							<div className="animate-pulse">
								<div className="h-8 bg-slate-200 rounded mb-4" />
								<div className="space-y-3">
									<div className="h-4 bg-slate-200 rounded" />
									<div className="h-4 bg-slate-200 rounded w-5/6" />
									<div className="h-4 bg-slate-200 rounded w-4/6" />
									<div className="h-4 bg-slate-200 rounded" />
									<div className="h-4 bg-slate-200 rounded w-3/4" />
								</div>
							</div>
							<p className="text-muted-foreground">Crafting your personalized sales letter...</p>
						</div>
					) : (
						<>
							{/* Header with controls */}
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-lg font-semibold text-muted-foreground">Your Personalized Sales Letter</h2>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handlePlayAudio}
										className="flex items-center gap-2"
									>
										{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
										{isPlaying ? "Stop" : "Listen"}
										<Volume2 className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopyText}
										className="flex items-center gap-2"
									>
										{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
										{copied ? "Copied!" : "Copy"}
									</Button>
								</div>
							</div>

							{/* The Sales Letter */}
							<div className="prose prose-lg max-w-none">
								{/* Headline */}
								<h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight mb-8">
									{selectedHeadline}
								</h1>

								{/* Generated Copy */}
								<div className="space-y-6 text-lg leading-relaxed text-foreground whitespace-pre-line">
									{salesLetter}
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Impact Moment */}
			<div className="text-center space-y-6">
				<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
					<p className="text-blue-800 font-medium text-lg mb-2">
						👆 This is what happens when you stop hoping and start building.
					</p>
					<p className="text-blue-700">
						You just created something that speaks directly to your situation. 
						That's the power of finding your people and building together.
					</p>
				</div>

				{!showNextStep ? (
					<Button 
						onClick={revealNextStep}
						size="lg"
						className="text-lg px-8 py-6"
					>
						So what's next? →
					</Button>
				) : (
					<div className="space-y-6 animate-fade-in">
						<Card className="bg-green-50 border-green-200">
							<CardContent className="p-6">
								<h3 className="text-xl font-bold text-green-800 mb-4">
									Here's what builders like you do next:
								</h3>
								<div className="space-y-4 text-left">
									<div className="flex items-start gap-3">
										<span className="text-green-600 font-bold">1.</span>
										<p className="text-green-700">
											<strong>Save this copy.</strong> You'll want to reference it when you're doubting yourself or explaining what you're building.
										</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-green-600 font-bold">2.</span>
										<p className="text-green-700">
											<strong>Share it with someone who gets it.</strong> Not for validation, but to find your first co-conspirator.
										</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="text-green-600 font-bold">3.</span>
										<p className="text-green-700">
											<strong>Join Hey.Builders early access.</strong> This is where people who chose similar headlines are already connecting and building together.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Button 
							size="lg"
							className="text-lg px-8 py-6 bg-black hover:bg-gray-800"
							onClick={() => setShowContactModal(true)}
						>
							Join Hey.Builders Early Access 🚀
						</Button>

						<p className="text-sm text-muted-foreground">
							Limited to builders who complete the copy experience • No spam, just opportunities to build together
						</p>
					</div>
				)}
			</div>

			{/* Contact Modal */}
			<Dialog open={showContactModal} onOpenChange={setShowContactModal}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-center text-2xl font-bold">
							Ready to connect?
						</DialogTitle>
					</DialogHeader>
					<div className="text-center space-y-4 py-4">
						<p className="text-lg text-muted-foreground">
							DM <span className="font-mono bg-blue-100 px-3 py-1 rounded text-blue-800 font-bold">@brianball</span> on X to learn more
						</p>
						<div className="bg-gray-50 p-4 rounded-lg border">
							<p className="text-sm text-gray-600">
								Let Brian know you completed the copy experience and he'll get you connected with other builders in the community.
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}