import "server-only"
import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getCoursesWithReview(category?: string) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const session = await requireUser()

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
            reviews: {
                where: {
                    userId: session.id
                },
                select: { 
                    rating: true, 
                    id: true 
                }, // get ratings
            },
        },
    })

        // if(!data){
        //     return notFound()
        // }

    return data.map(course => ({
        ...course,
        averageRating: course.reviews.length > 0
            ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
            : 0,
        totalReviews: course.reviews.length
    }))

    // return data

}


export type CourseReviewType = Awaited<ReturnType<typeof getCoursesWithReview>>[0]