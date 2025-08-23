// app/data/review/get-all-reviews.ts
import "server-only"
import { prisma } from "@/lib/db"

interface GetAllReviewsOptions {
    courseId?: string
    month?: string // Format: "YYYY-MM"
}

export async function getAllReviews(options: GetAllReviewsOptions = {}) {
    const { courseId, month } = options

    // Build date filter for month
    let dateFilter = {}
    if (month) {
        const [year, monthNum] = month.split('-').map(Number)
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        dateFilter = {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        }
    }

    const reviews = await prisma.review.findMany({
        where: {
            ...(courseId && { courseId }),
            ...dateFilter
        },
        include: {
            User: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return reviews
}

export type AdminReview = Awaited<ReturnType<typeof getAllReviews>>[0]