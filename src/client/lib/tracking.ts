
export interface HeadlineInteraction {
	headline: string;
	headlineIndex: number;
	timestamp: number;
}

export interface CopyChoice {
	sectionType: string;
	choice: string;
	timestamp: number;
}

export interface OnboardingSession {
	sessionId: string;
	headlineInteraction?: HeadlineInteraction;
	copyChoices: CopyChoice[];
	completedAt?: number;
	userAgent: string;
}

class OnboardingTracker {
	private session: OnboardingSession;

	constructor() {
		this.session = {
			sessionId: this.generateSessionId(),
			copyChoices: [],
			userAgent: navigator.userAgent,
		};
	}

	private generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	async trackHeadlineSelection(headline: string, headlineIndex: number) {
		this.session.headlineInteraction = {
			headline,
			headlineIndex,
			timestamp: Date.now(),
		};

		// Send to backend immediately for headline tracking
		try {
			await this.sendToBackend({
				headline,
				emoji: "none", // Placeholder for API compatibility
				benefitIndex: headlineIndex,
			});
		} catch (error) {
			console.warn("Failed to track headline selection:", error);
		}
	}

	async trackCopyChoice(sectionType: string, choice: string) {
		const copyChoice: CopyChoice = {
			sectionType,
			choice,
			timestamp: Date.now(),
		};

		this.session.copyChoices.push(copyChoice);

		// Send to backend
		try {
			await this.sendToBackend({
				headline: this.session.headlineInteraction?.headline || "unknown",
				emoji: "copy_choice", 
				benefitIndex: this.session.copyChoices.length - 1,
			});
		} catch (error) {
			console.warn("Failed to track copy choice:", error);
		}
	}

	async trackCompletion() {
		this.session.completedAt = Date.now();

		// Send final session summary if needed
		console.log("Onboarding session completed:", this.session);
	}

	private async sendToBackend(data: {
		headline: string;
		emoji: string;
		benefitIndex: number;
	}) {
		const response = await fetch("/api/onboarding/track", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Tracking failed: ${response.status}`);
		}

		return response.json();
	}

	// Get current session data for analytics
	getSession(): OnboardingSession {
		return { ...this.session };
	}

	// Calculate engagement score
	getEngagementScore(): number {
		const hasHeadline = !!this.session.headlineInteraction;
		const choiceCount = this.session.copyChoices.length;
		
		let score = 0;
		if (hasHeadline) {
			score += 20;
		}
		score += choiceCount * 15; // 15 points per copy choice
		if (this.session.completedAt) {
			score += 25;
		}

		return Math.min(score, 100); // Cap at 100
	}

	// Check if user is ready for commitment phase
	isReadyForCommitment(): boolean {
		return this.session.copyChoices.length >= 2;
	}
}

// Singleton instance
export const onboardingTracker = new OnboardingTracker();

// Helper functions for components
export const trackHeadlineSelection = (headline: string, index: number) => 
	onboardingTracker.trackHeadlineSelection(headline, index);

export const trackCopyChoice = (sectionType: string, choice: string) =>
	onboardingTracker.trackCopyChoice(sectionType, choice);

export const trackCompletion = () => 
	onboardingTracker.trackCompletion();

export const getEngagementScore = () => 
	onboardingTracker.getEngagementScore();

export const isReadyForCommitment = () => 
	onboardingTracker.isReadyForCommitment();