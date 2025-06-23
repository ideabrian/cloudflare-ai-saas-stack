import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { Card, CardContent } from "@client/components/ui/card";
import { Check, Brain, AlertTriangle, Target } from "lucide-react";

interface MultiSelectCopyBuilderProps {
	selectedHeadline: string;
	onComplete: (selectedOptions: string[]) => void;
}

// The 3 most impactful statements that capture the core user journey
const allCopyOptions = [
	{ id: "core-1", text: "I'm tired of building alone", category: "mindset" },
	{ id: "core-2", text: "I'm building in a vacuum", category: "challenge" },
	{ id: "core-3", text: "I need people who think like me", category: "desire" },
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

			{/* Simplified Options */}
			<div className="grid gap-6 max-w-3xl mx-auto">
				{allCopyOptions.map((option) => {
					const isSelected = selectedOptions.includes(option.id);
					const config = categoryConfig[option.category as keyof typeof categoryConfig];
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
							<CardContent className="p-6 relative overflow-hidden">
								{/* Background Pattern */}
								<div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.gradient}`} />
								
								{/* Selection Indicator */}
								{isSelected && (
									<div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-md transform rotate-12`}>
										<Check className="w-4 h-4 text-white font-bold" />
									</div>
								)}
								
								{/* Quote Icon */}
								<div className={`absolute top-4 left-4 w-10 h-10 rounded-lg bg-gradient-to-r ${config.gradient} opacity-10 flex items-center justify-center`}>
									<span className="text-2xl font-bold">"</span>
								</div>
								
								{/* Content */}
								<div className="relative pt-8 text-center">
									<p className={`text-xl leading-relaxed font-semibold transition-colors ${
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