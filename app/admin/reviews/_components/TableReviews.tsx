// app/admin/reviews/_components/TableReviews.tsx
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReviewCardStudent } from "./ReviewCardStudent";
import { Edit, Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AdminReview } from "@/app/data/review/get-all-reviews";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { deleteReview } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TableReviewsProps {
    reviews: AdminReview[]
}

export function TableReviews({ reviews }: TableReviewsProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleDelete(reviewId: string) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(deleteReview(reviewId))

            if (error) {
                toast.error('An unexpected error occurred. Please try again.')
                return
            }

            if (result.status === "success") {
                toast.success(result.message)
                router.push('/admin/reviews')
            } else if (result.status === "error") {
                toast.error(result.message)
            }
        })
    }

    if (reviews.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                No reviews found.
            </div>
        )
    }


    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-200  dark:bg-gray-600 ">
                    <TableHead className="w-[300px]">
                        Students & Courses
                    </TableHead>
                    <TableHead>
                        Ratings & Reviews
                    </TableHead>
                    <TableHead className="w-[120px]">
                        Posted Date
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {reviews.map((review) => (
                    <TableRow key={review.id}>
                        <TableCell>
                            <ReviewCardStudent
                                userImage={review.User?.image ?? `https://avatar.vercel.sh/${review.User?.email}`}
                                userName={review.User?.name || ""}
                                courseName={review.course?.title || ""}
                            />
                        </TableCell>
                        <TableCell>
                            <div>
                                <div className="flex items-center gap-1 mb-2">
                                    <Star
                                        className="fill-yellow-400 text-yellow-400 size-4"
                                    />
                                    <span className="ml-2 font-bold">{review.rating}.0</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {review.comment || "No comment provided"}
                                </p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm text-muted-foreground">
                                {format(new Date(review.createdAt), "dd.MMM.yyyy")}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(review.id)}
                                    disabled={isPending}
                                    className="text-gray-500 hover:text-red-600 cursor-pointer"
                                >
                                    {isPending ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="size-5" />
                                    )}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}