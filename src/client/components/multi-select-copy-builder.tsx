import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { Card, CardContent } from "@client/components/ui/card";
import { Check, Brain, AlertTriangle, Target, Lightbulb, Zap } from "lucide-react";

interface MultiSelectCopyBuilderProps {
	selectedHeadline: string;
	onComplete: (selectedOptions: string[]) => void;
}

// All the preview options from all sections combined
const allCopyOptions = [
	// Opening
	{ id: "opening-1", text: "I'm tired of building alone", category: "mindset" },
	{ id: "opening-2", text: "I'm looking for my people", category: "mindset" },
	{ id: "opening-3", text: "I'm done with the solo act", category: "mindset" },
	
	// Problem
	{ id: "problem-1", text: "I'm building in a vacuum", category: "challenge" },
	{ id: "problem-2", text: "I wonder 'what if' late at night", category: "challenge" },
	{ id: "problem-3", text: "Others are already ahead of me", category: "challenge" },
	
	// Solution
	{ id: "solution-1", text: "I need people who think like me", category: "desire" },
	{ id: "solution-2", text: "I want people in my corner", category: "desire" },
	{ id: "solution-3", text: "I'm ready to build, not just talk", category: "desire" },
	
	// Social Proof
	{ id: "social-1", text: "I know great projects aren't solo", category: "insight" },
	{ id: "social-2", text: "People like me are already here", category: "insight" },
	{ id: "social-3", text: "I need to find the right people", category: "insight" },
	
	// Urgency
	{ id: "urgency-1", text: "I'm losing momentum alone", category: "urgency" },
	{ id: "urgency-2", text: "Others are connecting without me", category: "urgency" },
	{ id: "urgency-3", text: "I should build relationships now", category: "urgency" },
];

const categoryConfig = {
	mindset: { 
		label: "Your Current Mindset", 
		icon: Brain, 
		gradient: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		ringColor: "ring-blue-500"
	},
	challenge: { 
		label: "Your Biggest Challenges", 
		icon: AlertTriangle,
		gradient: "from-orange-500 to-red-500", 
		bgColor: "bg-orange-50",
		borderColor: "border-orange-200",
		ringColor: "ring-orange-500"
	},
	desire: { 
		label: "What You Want", 
		icon: Target,
		gradient: "from-green-500 to-emerald-500",
		bgColor: "bg-green-50", 
		borderColor: "border-green-200",
		ringColor: "ring-green-500"
	},
	insight: { 
		label: "Your Realizations", 
		icon: Lightbulb,
		gradient: "from-yellow-500 to-amber-500",
		bgColor: "bg-yellow-50",
		borderColor: "border-yellow-200", 
		ringColor: "ring-yellow-500"
	},
	urgency: { 
		label: "What Drives You", 
		icon: Zap,
		gradient: "from-pink-500 to-rose-500",
		bgColor: "bg-pink-50",
		borderColor: "border-pink-200",
		ringColor: "ring-pink-500"
	}
};

export function MultiSelectCopyBuilder({ selectedHeadline, onComplete }: MultiSelectCopyBuilderProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

	const handleOptionToggle = (optionId: string) => {
		setSelectedOptions(prev => 
			prev.includes(optionId)
				? prev.filter(id => id !== optionId)
				: [...prev, optionId]
		);
	};

	const handleSubmit = () => {
		if (selectedOptions.length > 0) {
			onComplete(selectedOptions);
		}
	};

	const groupedOptions = Object.entries(categoryConfig).map(([category, config]) => ({
		category,
		config,
		options: allCopyOptions.filter(option => option.category === category)
	}));

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			{/* Selected headline - keep original large size */}
			<div className="text-center space-y-4">
				<h1 className="text-4xl md:text-6xl font-black text-green-600 leading-tight tracking-tight">
					{selectedHeadline}
				</h1>
				<p className="text-sm text-green-700 font-medium bg-green-50 inline-block px-3 py-1 rounded-full">
					✨ Select all the statements that feel like your inner voice
				</p>
			</div>

			{/* Instructions */}
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-semibold text-foreground">
					Choose everything that resonates
				</h2>
				<p className="text-muted-foreground">
					Pick as many or as few as you want - we'll craft your personalized sales letter from your selections
				</p>
			</div>

			{/* Grouped Options */}
			<div className="space-y-12">
				{groupedOptions.map(({ category, config, options }) => {
					const Icon = config.icon;
					return (
						<div key={category} className="space-y-6">
							{/* Category Header with Icon and Gradient */}
							<div className="flex items-center gap-3">
								<div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-lg`}>
									<Icon className="w-5 h-5 text-white" />
								</div>
								<h3 className="text-xl font-bold text-foreground">
									{config.label}
								</h3>
								<div className={`flex-1 h-px bg-gradient-to-r ${config.gradient} opacity-30`} />
							</div>
							
							{/* Options Grid */}
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{options.map((option) => {
									const isSelected = selectedOptions.includes(option.id);
									return (
										<Card 
											key={option.id}
											className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
												isSelected 
													? `ring-4 ${config.ringColor} ${config.bgColor} ${config.borderColor} shadow-lg` 
													: "hover:border-gray-300 border-gray-200 hover:shadow-md"
											}`}
											onClick={() => handleOptionToggle(option.id)}
										>
											<CardContent className="p-5 relative overflow-hidden">
												{/* Background Pattern */}
												<div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.gradient}`} />
												
												{/* Selection Indicator */}
												{isSelected && (
													<div className={`absolute top-3 right-3 w-6 h-6 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-md transform rotate-12`}>
														<Check className="w-3.5 h-3.5 text-white font-bold" />
													</div>
												)}
												
												{/* Quote Icon */}
												<div className={`absolute top-3 left-3 w-8 h-8 rounded-lg bg-gradient-to-r ${config.gradient} opacity-10 flex items-center justify-center`}>
													<span className="text-lg font-bold">"</span>
												</div>
												
												{/* Content */}
												<div className="relative pt-6">
													<p className={`text-lg leading-relaxed font-medium pr-8 transition-colors ${
														isSelected ? "text-gray-800" : "text-gray-700 group-hover:text-gray-900"
													}`}>
														{option.text}
													</p>
												</div>
												
												{/* Hover Effect Overlay */}
												<div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
											</CardContent>
										</Card>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* Submit */}
			<div className="text-center space-y-6">
				<div className="flex items-center justify-center gap-2">
					<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
					<div className="text-lg font-medium text-foreground">
						{selectedOptions.length} statement{selectedOptions.length !== 1 ? 's' : ''} selected
					</div>
					<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
				</div>
				<Button 
					onClick={handleSubmit}
					disabled={selectedOptions.length === 0}
					size="lg"
					className="text-lg px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 font-bold"
				>
					✨ Create My Personalized Sales Letter →
				</Button>
				{selectedOptions.length === 0 && (
					<p className="text-sm text-muted-foreground italic">
						Select at least one statement to continue
					</p>
				)}
			</div>
		</div>
	);
}