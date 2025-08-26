"use client"

import { useTransition, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { saveQuizAnswer } from "../actions"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import { CheckCircle2, XCircle, Lock } from "lucide-react"

type Props = {
    quizId: string
    slug: string
    data: {
        id: string;
        question: string;
        answers: {
            id: string;
            answer: string;
            correct: boolean
        }[]
        userAnswers: {
            id: string;
            userId: string;
            answer: string; // This is the answer ID the user selected
        }[]
    }
}

export default function AnswerQuizCard({ quizId, slug, data }: Props) {
    const [selected, setSelected] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Check if user has already answered this quiz
    useEffect(() => {
        if (data.userAnswers && data.userAnswers.length > 0) {
            const userAnswer = data.userAnswers[0]; // Get the first (and should be only) answer
            setIsSubmitted(true);

            // Set the selected answer
            setSelected(userAnswer.answer);

            // Check if the user's answer is correct
            const userSelectedAnswer = data.answers.find(a => a.id === userAnswer.answer);
            if (userSelectedAnswer) {
                setIsCorrect(userSelectedAnswer.correct);
            }
        }
    }, [data.userAnswers, data.answers])

    // Function to determine button className
    const getButtonClassName = (answerId: string, isCorrect: boolean) => {
        if (selected === answerId) {
            if (isSubmitted) {
                return isCorrect
                    ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-100"
                    : "bg-red-100 border-red-500 text-red-700 hover:bg-red-100"
            } else {
                return "bg-primary border-primary text-primary-foreground hover:bg-primary/90"
            }
        } else {
            return "bg-muted/50 hover:bg-muted border border-border"
        }
    }

    const handleSubmit = () => {
        if (!selected || isSubmitted) return

        // Find the selected answer object to get the answer text
        const selectedAnswerObj = data.answers.find(a => a.id === selected)
        if (!selectedAnswerObj) return

        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                saveQuizAnswer({ quizId, answer: selectedAnswerObj.answer, slug })
            )

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === "success") {
                setIsSubmitted(true)
                setIsCorrect(result.correct as boolean)

                if (result.correct) {
                    toast.success(result.message)
                } else {
                    toast.error(result.message)
                }
            } else if (result.status === "error") {
                toast.error(result.message)
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    {isSubmitted && <Lock className="h-5 w-5 text-muted-foreground" />}
                    Quiz Question
                </CardTitle>
                <p className="text-lg font-medium">{data.question}</p>
            </CardHeader>

            <CardContent className="space-y-3">
                {data.answers.map((a) => (
                    <Button
                        key={a.id}
                        onClick={() => !isSubmitted && setSelected(a.id)}
                        disabled={isSubmitted}
                        className={`w-full justify-start h-auto py-3 px-4 text-left whitespace-normal transition-all ${getButtonClassName(a.id, a.correct)}`}
                    >
                        <div className="flex items-center w-full">
                            {isSubmitted && selected === a.id && (
                                <>
                                    {a.correct ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                                    )}
                                </>
                            )}
                            <span className="flex-1">{a.answer}</span>
                            {isSubmitted && a.correct && selected !== a.id && (
                                <CheckCircle2 className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                            )}
                        </div>
                    </Button>
                ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                {!isSubmitted ? (
                    <>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !selected}
                            className="w-full"
                        >
                            {isPending ? "Submitting..." : "Submit Answer"}
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            You can only submit your answer once.
                        </p>
                    </>
                ) : (
                    <div className="w-full space-y-3">
                        <div className={`p-3 rounded-md text-center ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            <p className="font-medium">
                                {isCorrect
                                    ? "Correct! You answered this question correctly."
                                    : "Incorrect. The right answer is highlighted in green."}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            You've already answered this quiz question.
                        </p>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}