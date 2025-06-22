import { useState, useEffect } from "react";
import { Card, CardContent } from "@client/components/ui/card";
import type { CopyOption } from "@shared/schema/ai";

const copyFlowSections = [
	{ id: "opening", title: "Let's start with why you're here", type: "opening" as const },
	{ id: "problem", title: "Here's what you're probably dealing with", type: "problem" as const },
	{ id: "solution", title: "Here's what's possible instead", type: "solution" as const },
	{ id: "social_proof", title: "You're not alone in feeling this way", type: "social_proof" as const },
	{ id: "urgency", title: "Why waiting costs you", type: "urgency" as const },
];

interface ProgressiveCopyBuilderProps {
	selectedHeadline: string;
	onCopyChoice: (sectionType: string, choice: string) => void;
	onComplete: () => void;
}

export function ProgressiveCopyBuilder({ selectedHeadline, onCopyChoice, onComplete }: ProgressiveCopyBuilderProps) {
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
	const [copyChoices, setCopyChoices] = useState<string[]>([]);
	const [copyOptions, setCopyOptions] = useState<CopyOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showNextPrompt, setShowNextPrompt] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const currentSection = copyFlowSections[currentSectionIndex];
	const isLastSection = currentSectionIndex === copyFlowSections.length - 1;

	// Generate copy options when section changes
	useEffect(() => {
		const generateOptions = async () => {
			setIsLoading(true);
			setSelectedChoice(null);
			setShowNextPrompt(false);

			try {
				const response = await fetch("/api/ai/generate-copy", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						selectedHeadline,
						previousChoices: copyChoices,
						sectionType: currentSection.type,
					}),
				});

				const result = await response.json() as { success: boolean; data?: { options: CopyOption[] } };
				
				if (result.success && result.data?.options) {
					setCopyOptions(result.data.options);
				} else {
					// Fallback options if AI fails
					setCopyOptions(getFallbackOptions(currentSection.type));
				}
			} catch (error) {
				console.error("Failed to generate copy:", error);
				setCopyOptions(getFallbackOptions(currentSection.type));
			} finally {
				setIsLoading(false);
			}
		};

		generateOptions();
	}, [currentSection.type, selectedHeadline, copyChoices]);

	// Show next prompt after selection
	useEffect(() => {
		if (selectedChoice && !showNextPrompt) {
			const timer = setTimeout(() => {
				setShowNextPrompt(true);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [selectedChoice, showNextPrompt]);


	const getFallbackOptions = (sectionType: string): CopyOption[] => {
		const fallbacks = {
			opening: [
				{ 
					id: 1, 
					preview: "I'm tired of building alone", 
					text: "You chose that headline because something in you said 'Yes, I'm tired of building alone.' I get it - you've been there, grinding away in isolation, knowing there has to be a better way. The late nights, the second-guessing, the feeling like you're shouting into the void. What if I told you that the most successful builders aren't the ones with the best ideas, but the ones who found their people?" 
				},
				{ 
					id: 2, 
					preview: "I'm looking for my people", 
					text: "That headline hit you because you've felt it - that frustration of having great ideas but no one to build them with. You're not looking for more noise, you're looking for your people. The ones who get excited about the same problems you want to solve. Who understand why you care so much about getting the details right. Who won't look at you like you're crazy when you explain your vision." 
				},
				{ 
					id: 3, 
					preview: "I'm done with the solo act", 
					text: "You picked that because you're done with the solo act. Deep down, you know your best work happens when you're building alongside people who actually understand what you're trying to create. Not because you can't do it alone - you probably could - but because everything gets better when you're not carrying the whole weight yourself." 
				}
			],
			problem: [
				{ 
					id: 1, 
					preview: "I'm building in a vacuum", 
					text: "Here's what's really eating at you: It's not that you can't build - you can. It's that you're building in a vacuum, getting feedback from people who've never walked your path, wondering if you're completely off track. Your family means well, but they don't get it. Your current network sees what you're doing as a hobby. Meanwhile, you're pouring your heart into something that could change everything." 
				},
				{ 
					id: 2, 
					preview: "I wonder 'what if' late at night", 
					text: "You've been there - staring at your project late at night, knowing it could be so much more if you just had someone to bounce ideas off who actually gets it. But where do you find them? The people who've solved similar problems, who understand the technical challenges, who won't just say 'sounds cool' and change the subject. You need co-conspirators, not cheerleaders." 
				},
				{ 
					id: 3, 
					preview: "Others are already ahead of me", 
					text: "The worst part isn't the work itself. It's that nagging feeling that while you're figuring everything out alone, others are already collaborating and shipping things you wish you'd thought of first. They're not necessarily smarter or more talented - they just figured out how to find their people sooner. And now they're building momentum while you're still building solo." 
				}
			],
			solution: [
				{ 
					id: 1, 
					preview: "I need people who think like me", 
					text: "What if instead of hoping the right collaborators find you, you could actually find them? Hey.Builders is where people who think like you are already gathering - not to network awkwardly, but to actually build together. No elevator pitches, no business cards. Just builders who show up, ship things, and help each other win." 
				},
				{ 
					id: 2, 
					preview: "I want people in my corner", 
					text: "Imagine opening your laptop and knowing there are people in your corner who've faced your exact challenges and want to see you win. People who understand why you obsess over user experience, why you care about elegant code, why you lose sleep over product decisions. That's what becomes possible when you stop building alone." 
				},
				{ 
					id: 3, 
					preview: "I'm ready to build, not just talk", 
					text: "This isn't another networking platform where people collect connections like Pokemon cards. It's for builders who are done talking and ready to create something meaningful with people who actually show up. The kind of place where 'let's build this together' isn't just something people say - it's something they do." 
				}
			],
			social_proof: [
				{ 
					id: 1, 
					preview: "I know great projects aren't solo", 
					text: "The builders who get this early are the ones who've learned that great projects aren't solo missions. They've been where you are - talented, driven, but isolated. They know that finding your people isn't optional, it's essential. And they're already here, building the kind of collaborative relationships that turn good ideas into great outcomes." 
				},
				{ 
					id: 2, 
					preview: "People like me are already here", 
					text: "There are people just like you already here - people who've been building alone, who chose the same headlines you did, who are finally connecting with others who understand their vision. They're not waiting for permission or the perfect moment. They're building together, right now." 
				},
				{ 
					id: 3, 
					preview: "I need to find the right people", 
					text: "The most successful builders I know aren't necessarily the most talented - they're the ones who figured out how to find and keep the right collaborators. They started exactly where you are right now: talented, ambitious, but building alone. The difference is they stopped waiting for the right people to find them." 
				}
			],
			urgency: [
				{ 
					id: 1, 
					preview: "I'm losing momentum alone", 
					text: "Every month you spend building alone is momentum you could be gaining with the right team. Not because you can't do it solo - you probably could - but because everything gets better when you're not doing it all yourself. The ideas get sharper, the execution gets faster, and the journey gets infinitely more rewarding." 
				},
				{ 
					id: 2, 
					preview: "Others are connecting without me", 
					text: "While you're here reading this, other builders are already connecting and creating things that could change everything. They're not waiting for the perfect moment or the perfect opportunity. They're building the relationships that will define their next decade. The question isn't whether you can afford to join - it's whether you can afford not to." 
				},
				{ 
					id: 3, 
					preview: "I should build relationships now", 
					text: "The brutal truth? The best collaborative relationships form before you desperately need them. By the time you're ready to admit you need help, everyone else already has their teams. The builders who win aren't the ones who figure it out alone - they're the ones who build with others from the start." 
				}
			]
		};

		return fallbacks[sectionType as keyof typeof fallbacks] || [];
	};

	const handleCopySelection = (option: CopyOption) => {
		// Prevent duplicate selections
		if (selectedChoice) { return; }
		
		setSelectedChoice(option.text);
		const newChoices = [...copyChoices, option.text];
		setCopyChoices(newChoices);
		onCopyChoice(currentSection.type, option.text);
		
		// Auto-advance to next section quickly with smooth transition
		setIsTransitioning(true);
		setTimeout(() => {
			if (isLastSection) {
				onComplete();
			} else {
				setCurrentSectionIndex(prev => prev + 1);
				setIsTransitioning(false);
			}
		}, 300);
	};


	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Selected headline - keep original large size */}
			<div className="text-center space-y-4">
				<h1 className="text-4xl md:text-6xl font-black text-green-600 leading-tight tracking-tight">
					{selectedHeadline}
				</h1>
				<p className="text-sm text-green-700 font-medium bg-green-50 inline-block px-3 py-1 rounded-full">
					✨ Choose 5 options that feel like your inner voice
				</p>
			</div>

			{/* Progress indicator */}
			<div className="flex justify-center space-x-2 mb-8">
				{copyFlowSections.map((section, index) => (
					<div
						key={section.id}
						className={`w-3 h-3 rounded-full transition-all ${
							index === currentSectionIndex 
								? "bg-primary scale-125" 
								: index < currentSectionIndex
									? "bg-green-400"
									: "bg-muted"
						}`}
					/>
				))}
			</div>

			{/* Current section */}
			<div className={`text-center space-y-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
				<h2 className="text-2xl md:text-3xl font-semibold text-foreground">
					{currentSection.title}
				</h2>

				{/* No preview of copy during selection - save it for the big reveal! */}

				{/* Copy options */}
				{isLoading || isTransitioning ? (
					<div className="space-y-4">
						<p className="text-muted-foreground">
							{isLoading ? "Generating personalized copy options..." : "Moving to next choice..."}
						</p>
						<div className="animate-pulse space-y-3">
							{[1, 2, 3].map(i => (
								<div key={i} className="h-20 bg-slate-200 rounded" />
							))}
						</div>
					</div>
				) : selectedChoice && !isTransitioning ? (
					<div className="space-y-6">
						<div className="p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
							<p className="text-green-800 font-medium text-center">✓ Got it!</p>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<p className="text-muted-foreground mb-6">
							Choose the option that feels most like your inner voice:
						</p>
						
						<div className="grid gap-4 max-w-3xl mx-auto">
							{copyOptions.map((option) => (
								<Card 
									key={option.id} 
									className={`transition-all ${
										selectedChoice 
											? "cursor-not-allowed opacity-50" 
											: "cursor-pointer hover:shadow-lg hover:border-primary/50"
									}`}
									onClick={() => !selectedChoice && handleCopySelection(option)}
								>
									<CardContent className="p-6">
										<p className="text-left leading-relaxed text-foreground font-medium">
											{option.preview || option.text}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Section progress */}
			<div className="text-center">
				<p className="text-sm text-muted-foreground">
					Choice {currentSectionIndex + 1} of {copyFlowSections.length} • Quick picks based on gut feeling
				</p>
			</div>
		</div>
	);
}