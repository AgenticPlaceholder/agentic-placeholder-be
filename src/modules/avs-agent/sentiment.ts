import ollama from 'ollama';

interface SentimentResult {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    confidence: number;
    combinedScore: number;
    details: {
        starRating: number;
        commentSentiment: {
            sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
            confidence: number;
        };
        weightedScore: number;
    };
}

export class CommentRatingAnalyzer {
    // Configurable weights and thresholds
    private readonly RATING_WEIGHT = 0.5;  // Changed from 0.6 to 0.5 for more balanced weighting
    private readonly TEXT_WEIGHT = 0.5;    // Changed from 0.4 to 0.5
    private readonly POSITIVE_THRESHOLD = 0.65;  // Slightly lowered from 0.7
    private readonly NEGATIVE_THRESHOLD = 0.35;  // Slightly raised from 0.3

    async analyzeSentiment(comment: string, starRating: number): Promise<SentimentResult> {
        try {
            if (starRating < 1 || starRating > 5 || !Number.isInteger(starRating)) {
                throw new Error('Star rating must be an integer between 1 and 5');
            }

            // Enhanced prompt for better handling of ambiguous text
            const response = await ollama.chat({
                model: 'mistral',
                messages: [
                    {
                        role: 'system',
                        content: `You are a sentiment analyzer specialized in customer feedback. 
            Consider these guidelines:
            - "ok", "fine", "alright" are NEUTRAL unless context suggests otherwise
            - Single word responses should default to NEUTRAL with lower confidence
            - Consider both explicit and implicit sentiment
            
            Respond in JSON format with:
            {
              "sentiment": "POSITIVE" or "NEGATIVE" or "NEUTRAL",
              "confidence": (number between 0-1, lower for ambiguous cases)
            }`
                    },
                    {
                        role: 'user',
                        content: comment
                    }
                ]
            });

            const commentSentiment = JSON.parse(response.message.content);

            // Enhanced rating score calculation
            const ratingScore = this.calculateRatingScore(starRating);

            // Calculate weighted score with new approach
            const weightedScore = this.calculateWeightedScore(
                ratingScore,
                commentSentiment.confidence,
                commentSentiment.sentiment,
                comment.length  // Consider comment length in weighting
            );

            // Determine final sentiment with more nuanced approach
            const finalSentiment = this.determineOverallSentiment(
                weightedScore,
                starRating,
                commentSentiment.sentiment,
                comment
            );

            return {
                sentiment: finalSentiment,
                confidence: this.calculateOverallConfidence(
                    commentSentiment.confidence,
                    starRating,
                    comment.length
                ),
                combinedScore: weightedScore,
                details: {
                    starRating: starRating,
                    commentSentiment: {
                        sentiment: commentSentiment.sentiment,
                        confidence: commentSentiment.confidence
                    },
                    weightedScore: weightedScore
                }
            };
        } catch (error) {
            console.error('Error in sentiment analysis:', error);
            throw error;
        }
    }

    private calculateRatingScore(starRating: number): number {
        // Enhanced rating score with non-linear scaling
        if (starRating >= 4) return 0.8 + ((starRating - 4) * 0.2);
        if (starRating <= 2) return 0.2 + ((starRating - 1) * 0.2);
        return 0.5;  // Middle rating (3) maps to neutral 0.5
    }

    private calculateWeightedScore(
        ratingScore: number,
        textConfidence: number,
        commentSentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
        commentLength: number
    ): number {
        // Convert text sentiment to score with more nuance
        let textScore;
        switch (commentSentiment) {
            case 'POSITIVE':
                textScore = 0.75 + (0.25 * textConfidence);
                break;
            case 'NEGATIVE':
                textScore = 0.25 * textConfidence;
                break;
            case 'NEUTRAL':
                textScore = 0.5;
                break;
        }

        // Adjust weights based on comment length
        let finalRatingWeight = this.RATING_WEIGHT;
        let finalTextWeight = this.TEXT_WEIGHT;

        if (commentLength < 5) {  // Very short comments
            finalRatingWeight = 0.7;  // Give more weight to rating
            finalTextWeight = 0.3;
        } else if (commentLength > 50) {  // Longer comments
            finalRatingWeight = 0.4;  // Give more weight to text
            finalTextWeight = 0.6;
        }

        return (ratingScore * finalRatingWeight) + (textScore * finalTextWeight);
    }

    private determineOverallSentiment(
        weightedScore: number,
        starRating: number,
        commentSentiment: string,
        comment: string
    ): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
        // Don't automatically classify based on rating alone
        if (weightedScore >= this.POSITIVE_THRESHOLD &&
            (starRating >= 4 || commentSentiment === 'POSITIVE')) {
            return 'POSITIVE';
        } else if (weightedScore <= this.NEGATIVE_THRESHOLD &&
            (starRating <= 2 || commentSentiment === 'NEGATIVE')) {
            return 'NEGATIVE';
        }

        // Handle very short comments with more nuance
        if (comment.length < 5) {
            if (starRating >= 4) return 'POSITIVE';
            if (starRating <= 2) return 'NEGATIVE';
        }

        return 'NEUTRAL';
    }

    private calculateOverallConfidence(
        textConfidence: number,
        starRating: number,
        commentLength: number
    ): number {
        // Base confidence on multiple factors
        let confidence = (textConfidence + (starRating / 5)) / 2;

        // Reduce confidence for very short comments
        if (commentLength < 5) {
            confidence *= 0.8;
        }

        // Reduce confidence for middle ratings
        if (starRating === 3) {
            confidence *= 0.9;
        }

        return confidence;
    }

    getDescriptiveFeedback(result: SentimentResult): string {
        const { starRating } = result.details;
        const { sentiment, confidence } = result.details.commentSentiment;

        if (confidence < 0.5) {
            return 'Low confidence assessment - consider reviewing manually';
        }

        if (sentiment === 'POSITIVE' && starRating >= 4) {
            return 'Very positive feedback with matching high rating';
        } else if (sentiment === 'NEGATIVE' && starRating <= 2) {
            return 'Negative feedback consistent with low rating';
        } else if (Math.abs(starRating - 3) <= 1 && sentiment === 'NEUTRAL') {
            return 'Neutral feedback with matching middle rating';
        } else if (Math.abs(this.calculateRatingScore(starRating) - result.combinedScore) > 0.3) {
            return 'Significant discrepancy between rating and comment sentiment';
        } else {
            return 'Mixed feedback with moderate sentiment consistency';
        }
    }
}