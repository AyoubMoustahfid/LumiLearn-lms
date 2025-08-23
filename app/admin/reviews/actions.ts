"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import arcjet from "@/lib/arcjet"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/type"
import { fixedWindow, request } from "@arcjet/next"
import { revalidatePath } from "next/cache"


const aj = arcjet
    .withRule(
        fixedWindow({
            mode: "LIVE",
            window: "1m",
            max: 5
        })
    )

export async function deleteReview(reviewId: string): Promise<ApiResponse> {
    const session = await requireAdmin()

    try {
        const req = await request()
        const decision = await aj.protect(req, {
            fingerprint: session.user.id
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return {
                    status: "error",
                    message: "Looks like you are a malicus user"
                }
            }else {
                return {
                    status: "error",
                    message: "You are a bot! if this is a mistake contact our support"
                }
            }
        }

        await prisma.review.delete({
            where: {
                id: reviewId
            }
        })

        revalidatePath('/admin/reviews')

        return {
            status: "success",
            message: "Review deleted successfully"
        }
    } catch {
        return {
            status: "error",
            message: "Failed delete Review"
        }
    }
}