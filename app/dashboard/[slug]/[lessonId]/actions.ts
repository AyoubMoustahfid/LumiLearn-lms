"use server"

import { requireUser } from "@/app/data/user/require-user"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/type"
import { revalidatePath } from "next/cache"


export async function markLessonComplete(lessonId: string, slug: string): Promise<ApiResponse> {

    const session = await requireUser()

    try {

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId
                },
            },
            update: {
                completed: true,
            },
            create: {
                lessonId,
                userId: session.id,
                completed: true
            }
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status: 'success',
            message: "Progress updated successfully"
        }

    } catch {
        return {
            status: "error",
            message: "Failed to mark lesson as complete"
        }
    }
}




export async function submitReview(courseId: string, rating: number, comment?: string) {
    try {
        const session = await requireUser()

        // Check if user has already reviewed this course
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_courseId: {
                    userId: session.id,
                    courseId: courseId
                }
            }
        })

        if (existingReview) {
            // Update existing review
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment }
            })
            revalidatePath(`/dashboard/[slug]`)
            return { success: true, review: updatedReview }
        } else {
            // Create new review
            const newReview = await prisma.review.create({
                data: {
                    rating,
                    comment,
                    courseId,
                    userId: session.id
                }
            })
            revalidatePath(`/dashboard/[slug]`)
            return { success: true, review: newReview }
        }
    } catch (error) {
        return { success: false, error: "Failed to submit review" }
    }
}

export async function getUserReview(courseId: string) {
    try {
        const session = await requireUser()

        return await prisma.review.findUnique({
            where: {
                userId_courseId: {
                    userId: session.id,
                    courseId: courseId
                }
            }
        })
    } catch {
        return {
            status: "error",
            message: "Failed to answer the question"
        }
    }
}


export async function saveQuizAnswer({
    quizId,
    answer,
    slug,
}: { quizId: string; answer: string; slug: string }) {
    try {
        const user = await requireUser()

        // Find the quiz + answers
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                answers: true,
            },
        })

        if (!quiz) {
            return { status: "error", message: "Quiz not found" }
        }

        // Find which answer user selected
        const selectedAnswer = quiz.answers.find((a) => a.id === answer || a.answer === answer)
        if (!selectedAnswer) {
            return { status: "error", message: "Invalid answer" }
        }

        const isCorrect = selectedAnswer.correct

        // Check if user already answered this quiz
        const existingAnswer = await prisma.userQuizAnswer.findFirst({
            where: { userId: user.id, quizId }
        })

        if (existingAnswer) {
            // Update existing answer
            await prisma.userQuizAnswer.update({
                where: { id: existingAnswer.id },
                data: { answer: selectedAnswer.id },
            })
        } else {
            // Create new answer
            await prisma.userQuizAnswer.create({
                data: {
                    quizId,
                    userId: user.id,
                    answer: selectedAnswer.id,
                },
            })
        }

        // If correct → award points
        if (isCorrect) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    points: { increment: quiz.points }, // assumes User model has a `points` field
                },
            })
        }

        // Revalidate dashboard
        revalidatePath(`/dashboard/${slug}`)

        return {
            status: "success",
            message: isCorrect
                ? `Correct! You gained ${quiz.points} points.`
                : "Incorrect. Try again!",
            correct: isCorrect,
        }
    } catch (e) {
        console.error(e)
        return {
            status: "error",
            message: "Failed to answer the question",
        }
    }
}
