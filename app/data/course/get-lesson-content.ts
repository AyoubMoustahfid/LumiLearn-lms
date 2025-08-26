import "server-only"
import { requireUser } from "../user/require-user"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"


export async function getLessonContent(lessonId: string, quizId?: string) {
    const session = await requireUser()

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,
            lessonProgress: {
                where: {
                    userId: session.id,
                },
                select: {
                    completed: true,
                    lessonId: true
                }
            },
            Chapter: {
                select: {
                    courseId: true,
                    Course: {
                        select: {
                            slug: true
                        }
                    }
                }
            },
            quizzes: {
                where: quizId ? { id: quizId } : undefined,
                select: {
                    id: true,
                    question: true, // assuming you have this field
                    estimationTime: true,
                    points: true,
                    answers: {
                        select: {
                            id: true,
                            answer: true,       // answer text
                            correct: true,  // or another field name if you don’t expose correctness to user
                        },
                    },
                     userAnswers: {
                        where: {
                            userId: session.id // Only get current user's answer
                        },
                        select: {
                            id: true,
                            userId: true,
                            answer: true, // This is the answer ID the user selected
                        }
                    }
                },
            },
        }
    })

    if(!lesson){
        return notFound()
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.id,
                courseId: lesson.Chapter.courseId
            }
        },
        select: {
            status: true
        }
    })

    if(!enrollment || enrollment.status !== "Active"){
        return notFound()
    }

    return lesson
}


export type LessonCotentType = Awaited<ReturnType<typeof getLessonContent>>