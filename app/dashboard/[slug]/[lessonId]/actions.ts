"use server"

import { requireUser } from "@/app/data/user/require-user"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/type"
import { revalidatePath } from "next/cache"


export async function markLessonComplete(lessonId: string, slug: string): Promise<ApiResponse> {

    const session = await requireUser()

    try{

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

    }catch {
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
    console.error("Error submitting review:", error)
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
  } catch (error) {
    console.error("Error fetching user review:", error)
    return null
  }
}