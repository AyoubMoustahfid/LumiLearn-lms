// dashboard/[slug]/[lessonId]/_components/ReviewComponent.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { submitReview } from "../actions"
import { toast } from "sonner"

interface ReviewComponentProps {
  courseId: string
  slug: string
  initialReview?: {
    rating: number
    comment?: string
    id: string
  }
  isCourseCompleted: boolean
}

export function ReviewComponent({ 
  courseId, 
  slug, 
  initialReview, 
  isCourseCompleted 
}: ReviewComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [rating, setRating] = useState(initialReview?.rating || 0)
  const [comment, setComment] = useState(initialReview?.comment || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasReviewed = !!initialReview
  const isEditing = hasReviewed && searchParams.get('review-course')

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating)
      setComment(initialReview.comment || "")
    }
  }, [initialReview])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitReview(courseId, rating, comment)
      
      if (result.success) {
        toast.success(hasReviewed ? "Review updated successfully!" : "Review submitted successfully!")
        // Remove review parameter and go back to course overview
        const params = new URLSearchParams(searchParams.toString())
        params.delete('review-course')
        router.replace(`/dashboard/${slug}?${params.toString()}`)
      } else {
        setError(result.error || "Failed to submit review")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('review-course')
    router.replace(`/dashboard/${slug}?${params.toString()}`)
  }

  // User hasn't completed the course
  if (!isCourseCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Not Available</CardTitle>
            <CardDescription>
              You need to complete the course before you can leave a review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCancel}>
              Return to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User has already reviewed and is not editing
  if (hasReviewed && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Review Submitted
            </CardTitle>
            <CardDescription>
              Thank you for reviewing this course!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                {rating}/5 stars
              </span>
            </div>
            
            {comment && (
              <div>
                <p className="text-sm font-medium mb-1">Your comment:</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {comment}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button onClick={handleCancel}>
                Return to Course
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Stay on the review page for editing
                  const params = new URLSearchParams()
                  params.set('review-course', courseId)
                  router.replace(`/dashboard/${slug}?${params.toString()}`)
                }}
              >
                Edit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User can review or edit existing review
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {hasReviewed ? "Edit Your Review" : "Review This Course"}
          </CardTitle>
          <CardDescription>
            {hasReviewed 
              ? "Update your review to help other students"
              : "Share your experience to help other students"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like about this course? What could be improved?"
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting 
                ? "Submitting..." 
                : hasReviewed 
                  ? "Update Review" 
                  : "Submit Review"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}