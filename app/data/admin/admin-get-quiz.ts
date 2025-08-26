"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "./require-admin"
import { notFound } from "next/navigation"



export async function adminGetQuiz(id: string) {
    await requireAdmin()
    
    const data = await prisma.quiz.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            question: true,
            randomizeOrder: true,
            estimationTime: true,
            points: true,
            lessonId: true,
            answers: true
        }
    })

        if(!data){
            return notFound()
        }
    
        return data
}

export type AdminQuizType = Awaited<ReturnType<typeof adminGetQuiz>>