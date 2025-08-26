"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createQuizWithAnswers } from "../actions"

type AnswerRow = { answer: string; correct: boolean }

export function NewQuizModal({ lessonId }: { lessonId: string }) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // form state
    const [question, setQuestion] = useState("")
    const [estimationTime, setEstimationTime] = useState<number | "">("")
    const [points, setPoints] = useState<number | "">("")
    const [randomizeOrder, setRandomizeOrder] = useState(false)
    const [answers, setAnswers] = useState<AnswerRow[]>([
        { answer: "", correct: false },
        { answer: "", correct: false },
    ])

    function setCorrectIndex(idx: number) {
        setAnswers((prev) => prev.map((a, i) => ({ ...a, correct: i === idx })))
    }

    function updateAnswer(idx: number, text: string) {
        setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, answer: text } : a)))
    }

    function addAnswer() {
        setAnswers((prev) => [...prev, { answer: "", correct: false }])
    }

    function removeAnswer(idx: number) {
        setAnswers((prev) => {
            if (prev.length <= 2) return prev // keep at least 2
            const removedWasCorrect = prev[idx].correct
            const next = prev.filter((_, i) => i !== idx)
            // if we removed the correct one, unset all (user must pick again)
            return removedWasCorrect ? next.map((a) => ({ ...a, correct: false })) : next
        })
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)

        try {
            const payload = {
                question,
                randomizeOrder,
                estimationTime: Number(estimationTime),
                points: Number(points),
                lessonId,
                answers: answers.map((a) => ({ answer: a.answer.trim(), correct: a.correct })),
            }

            console.log('payload', payload)

            const res = await createQuizWithAnswers(payload)
            if (res.status === "success") {
                toast.success("Quiz created")
                // reset
                setQuestion("")
                setEstimationTime("")
                setPoints("")
                setRandomizeOrder(false)
                setAnswers([
                    { answer: "", correct: false },
                    { answer: "", correct: false },
                ])
                setOpen(false)
            } else {
                // Zod issues or message
                const msg =
                    "issues" in res
                        ? Object.values(res.issues?.fieldErrors ?? {})
                            .flat()
                            .join("\n")
                        : res.message ?? "Failed to create quiz"
                toast.error(msg)
            }
        } catch (err) {
            toast.error("Something went wrong creating the quiz")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">+ Quiz</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create quiz</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <Textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type the question"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time (min)</label>
                            <Input
                                type="number"
                                min={1}
                                max={30}
                                value={estimationTime}
                                onChange={(e) => setEstimationTime(e.target.value === "" ? "" : Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Points</label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={points}
                                onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="randomize"
                                type="checkbox"
                                checked={randomizeOrder}
                                onChange={(e) => setRandomizeOrder(e.target.checked)}
                            />
                            <label htmlFor="randomize" className="text-sm">
                                Randomize answers
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Answers</h4>
                            <Button type="button" variant="secondary" size="sm" onClick={addAnswer}>
                                Add answer
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {answers.map((a, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    {/* single-correct radio */}
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={a.correct}
                                        onChange={() => setCorrectIndex(idx)}
                                        title="Mark as correct"
                                    />
                                    <Input
                                        value={a.answer}
                                        onChange={(e) => updateAnswer(idx, e.target.value)}
                                        placeholder={`Answer ${idx + 1}`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => removeAnswer(idx)}
                                        disabled={answers.length <= 2}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Saving..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
