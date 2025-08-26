"use client"

import { AdminQuizType } from "@/app/data/admin/admin-get-quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quizSchema, QuizSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "../../../_component/Form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransition } from "react";
import { useRouter } from "next/router";
import { tryCatch } from "@/hooks/try-catch";
import { editQuiz } from "../actions";
import { toast } from "sonner";
import { Loader2, PlusIcon } from "lucide-react";

interface SingleQuizDisplayProps {
    data: AdminQuizType
    lessonId: string,
    courseId: string
}

export function SingleQuizDisplay({ data, lessonId, courseId }: SingleQuizDisplayProps) {

    const [isPending, startTransition] = useTransition()

    const form = useForm<QuizSchemaType>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            question: data.question,
            estimationTime: data.estimationTime,
            randomizeOrder: data.randomizeOrder,
            points: data.points,
            lessonId,
            answers: data.answers as QuizSchemaType["answers"],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "answers",
    });

    const onSubmit = (values: QuizSchemaType) => {
        // TODO: Call mutation (prisma API) to save changes
        startTransition(async () => {
            const { data: result, error } = await tryCatch(editQuiz(values, data.id, courseId))

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
            } else if (result.status === "error") {
                toast.error(result.message)
            }

        })
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Quiz</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Question */}
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Question" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Estimation Time */}
                        <FormField
                            control={form.control}
                            name="estimationTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimation Time (minutes)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min="1" 
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Points */}
                        <FormField
                            control={form.control}
                            name="points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min="0" 
                                            {...field} 
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Randomize Order */}
                        <FormField
                            control={form.control}
                            name="randomizeOrder"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Randomize Answers Order</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Answers */}
                        <div>
                            <FormLabel>Answers</FormLabel>
                            <div className="space-y-3">
                                {fields.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 border p-2 rounded-md"
                                    >
                                        <FormField
                                            control={form.control}
                                            name={`answers.${index}.answer`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Answer text" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`answers.${index}.correct`} // ✅ matches schema
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Correct</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                className="mt-2"
                                onClick={() =>
                                    append({ answer: "", correct: false })
                                }
                            >
                                + Add Answer
                            </Button>
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full">
                            {isPending ? (
                                <>
                                    Updating...
                                    <Loader2 className='animate-spin ml-1' />
                                </>
                            ) : (
                                <>
                                    Save Quiz
                                    <PlusIcon className='ml-1' size={16} />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
