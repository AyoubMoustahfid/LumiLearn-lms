import "server-only"
import { prisma } from "@/lib/db";

export async function getAllCourses(category?: string) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = await prisma.course.findMany({
        where: {
            status: "Published",
            ...(category && category !== "all" ? { category } : {}),
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            price: true,
            smallDescription: true,
            slug: true,
            fileKey: true,
            level: true,
            duration: true,
            category: true,
        },
    })

    return data.map(course => ({
        ...course,
        averageRating: 0,
        totalReviews: 0
    }))

}


export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]