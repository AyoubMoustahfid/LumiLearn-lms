import "server-only"
import { requireUser } from "./require-user"
import { prisma } from "@/lib/db"



export async function getEnrolledCourses() {

    const user = await requireUser()

    const data = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: "Active",
        },
        include: {
            Course: {
                select: {
                    id: true,
                    smallDescription: true,
                    title: true,
                    fileKey: true,
                    level: true,
                    slug: true,
                    duration: true,
                    chapter: {
                        select: {
                            id: true,
                            lessons: {
                                select: {
                                    id: true,
                                    lessonProgress: {
                                        where: { userId: user.id },
                                        select: {
                                            id: true,
                                            completed: true,
                                            lessonId: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    reviews: {
                        where: {
                            userId: user.id
                        },
                        select: {
                            rating: true,
                            id: true
                        }
                    }
                },
            },
        },
    });



    return data
}

export type EnrolledCourseType = Awaited<ReturnType<typeof getEnrolledCourses>>[0]