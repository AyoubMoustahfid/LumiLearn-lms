"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReviewCardStudent } from "./ReviewCardStudent";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { AdminReview } from "@/app/data/review/get-all-reviews";
import { DeleteReview } from "@/app/dashboard/[slug]/[lessonId]/_components/DeleteReview";

interface TableReviewsProps {
    reviews: AdminReview[]
}

export function TableReviews({ reviews }: TableReviewsProps) {


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
                                <DeleteReview
                                    reviewId={review.id}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}