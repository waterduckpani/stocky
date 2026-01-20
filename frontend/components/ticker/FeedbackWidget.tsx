"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackWidgetProps {
    contentId?: string | null;
    isAiGenerated?: boolean;
    conceptName?: string;
}

export function FeedbackWidget({
    contentId,
    isAiGenerated = true,
    conceptName = "this lesson",
}: FeedbackWidgetProps) {
    const [submitted, setSubmitted] = useState(false);
    const [vote, setVote] = useState<"up" | "down" | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVote = async (voteType: "up" | "down") => {
        if (submitted) return;

        setLoading(true);
        setVote(voteType);

        // If no content ID, just show thanks (frontend-only feedback for now)
        if (!contentId) {
            setSubmitted(true);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/feedback?content_id=${contentId}&vote=${voteType}`,
                { method: "POST" }
            );

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            // Still show thanks even if backend fails
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    // Always show for AI-generated content
    if (!isAiGenerated) {
        return null;
    }

    if (submitted) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Thanks for your feedback!</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3">
            <span className="text-sm text-muted-foreground">
                Was {conceptName} helpful?
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote("up")}
                    disabled={loading}
                    className="h-8 px-3 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30"
                >
                    <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote("down")}
                    disabled={loading}
                    className="h-8 px-3 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                >
                    <ThumbsDown className="w-4 h-4" />
                </Button>
            </div>
            {isAiGenerated && (
                <span className="text-xs text-muted-foreground/60 ml-2">
                    ✨ AI Generated
                </span>
            )}
        </div>
    );
}
