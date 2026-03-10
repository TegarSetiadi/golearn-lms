"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trophy, ChevronRight } from "lucide-react";
import { submitQuizResults } from "@/actions/quiz";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
}

interface QuizProps {
    quizId: string;
    title: string;
    questions: Question[];
}

export default function QuizComponent({ quizId, title, questions }: QuizProps) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentQuestionIdx];

    const handleNext = async () => {
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const bridgeScore = isCorrect ? score + 1 : score;
        setScore(bridgeScore);

        if (currentQuestionIdx + 1 < questions.length) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedAnswer(null);
        } else {
            setIsFinished(true);
            const finalScore = Math.round((bridgeScore / questions.length) * 100);
            await submitQuizResults(quizId, finalScore);
        }
    };

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <Card className="border-primary/20 bg-primary/5 shadow-inner">
                <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Trophy className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-2 italic">Quiz Completed!</h2>
                    <p className="text-muted-foreground mb-6">You scored <span className="text-primary font-bold">{percentage}%</span></p>
                    <div className="text-5xl font-extrabold text-primary mb-8">{score} / {questions.length}</div>
                    <Button onClick={() => window.location.reload()} className="rounded-xl px-8">Retake Quiz</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/10 bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-lg italic">{title}</CardTitle>
                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                    Question {currentQuestionIdx + 1} of {questions.length}
                </span>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
                <h3 className="text-xl font-bold text-primary leading-snug">
                    {currentQuestion.question}
                </h3>
                <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} className="space-y-3">
                    {["A", "B", "C", "D"].map((opt) => {
                        const label = opt === "A" ? currentQuestion.optionA :
                            opt === "B" ? currentQuestion.optionB :
                                opt === "C" ? currentQuestion.optionC : currentQuestion.optionD;
                        const value = opt.toLowerCase();
                        return (
                            <div key={opt} className={cn(
                                "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer hover:bg-primary/5",
                                selectedAnswer === value ? "border-primary bg-primary/10" : "border-slate-100"
                            )}>
                                <RadioGroupItem value={value} id={`opt-${opt}`} className="text-primary" />
                                <Label htmlFor={`opt-${opt}`} className="flex-1 cursor-pointer font-medium text-slate-700">{label}</Label>
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter className="bg-slate-50/50 pt-6 pb-6 border-t flex justify-end">
                <Button
                    disabled={!selectedAnswer}
                    onClick={handleNext}
                    className="rounded-xl px-10 bg-primary hover:bg-primary/90 font-bold gap-2"
                >
                    {currentQuestionIdx + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card >
    );
}

