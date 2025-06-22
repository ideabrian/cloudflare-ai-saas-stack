import { useState, useEffect } from "react";
import { Button } from "@client/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const headlines = [
	"Stop building alone. Start building together.",
	"Your next breakthrough needs the right co-conspirators.",
	"Tired of launching into the void? Find your tribe.",
	"Great ideas die in isolation. Yours doesn't have to.",
	"The best builders aren't solo acts. Join the ensemble.",
	"Your vision deserves co-creators, not just customers.",
	"Stop pitching. Start building with people who get it.",
	"The future belongs to collaborative builders.",
];

interface HeadlinePickerProps {
	onHeadlineSelect: (headline: string, index: number) => void;
}

export function HeadlinePicker({ onHeadlineSelect }: HeadlinePickerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [selectedHeadline, setSelectedHeadline] = useState<string | null>(null);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	// Handle keyboard navigation
	useEffect(() => {
		if (selectedHeadline) { return; }

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				navigateHeadline('prev');
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				navigateHeadline('next');
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleHeadlineClick();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedHeadline]);

	const navigateHeadline = (direction: 'prev' | 'next') => {
		if (selectedHeadline) { return; }
		
		setIsAnimating(true);
		setTimeout(() => {
			if (direction === 'next') {
				setCurrentIndex((prev) => (prev + 1) % headlines.length);
			} else {
				setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length);
			}
			setIsAnimating(false);
		}, 200);
	};

	// Touch handlers for mobile swipe
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStart || !touchEnd) { return; }
		
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe) {
			navigateHeadline('next');
		} else if (isRightSwipe) {
			navigateHeadline('prev');
		}
	};

	const handleHeadlineClick = () => {
		const headline = headlines[currentIndex];
		setSelectedHeadline(headline);
		onHeadlineSelect(headline, currentIndex);
	};

	return (
		<div className="text-center max-w-4xl mx-auto">
			<div 
				className="mb-8 cursor-pointer select-none"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<h1 
					className={`text-4xl md:text-6xl tracking-tight transition-all duration-300 ${
						isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
					} ${selectedHeadline ? "text-green-600 font-black scale-105" : "text-foreground font-bold"}`}
					style={{ minHeight: "120px" }}
				>
					{headlines[currentIndex]}
				</h1>
			</div>

			{!selectedHeadline ? (
				<div className="space-y-6">
					{/* Navigation arrows */}
					<div className="flex items-center justify-center gap-8">
						<Button 
							variant="outline" 
							size="lg"
							onClick={() => navigateHeadline('prev')}
							className="h-12 w-12 rounded-full"
							aria-label="Previous headline"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
						
						<div className="text-center">
							<p className="text-lg text-muted-foreground mb-2">
								👆 If this resonates, tap it.
							</p>
							<p className="text-sm text-muted-foreground mb-1">
								Use ← → arrow keys or buttons to explore
							</p>
							<p className="text-xs text-muted-foreground">
								{currentIndex + 1} of {headlines.length}
							</p>
						</div>
						
						<Button 
							variant="outline" 
							size="lg"
							onClick={() => navigateHeadline('next')}
							className="h-12 w-12 rounded-full"
							aria-label="Next headline"
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</div>
					
					<Button 
						onClick={handleHeadlineClick}
						size="lg"
						className="text-lg px-8 py-6"
					>
						Yes, this speaks to me
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					<p className="text-lg text-green-600 font-medium">
						✨ Great choice. Let's see what unlocks next...
					</p>
				</div>
			)}

			{/* Progress indicator */}
			<div className="mt-12 flex justify-center space-x-2">
				{headlines.map((headline, index) => (
					<div
						key={`headline-${index}-${headline.slice(0, 10)}`}
						className={`w-2 h-2 rounded-full transition-all ${
							index === currentIndex 
								? "bg-primary w-8" 
								: selectedHeadline
									? "bg-green-200"
									: "bg-muted"
						}`}
					/>
				))}
			</div>
		</div>
	);
}