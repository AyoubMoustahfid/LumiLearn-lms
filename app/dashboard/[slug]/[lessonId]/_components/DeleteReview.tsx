"use client"

import { deleteReview } from "@/app/admin/reviews/actions";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";


type Props = {
    reviewId : string
}


export function DeleteReview({reviewId} : Props) {
    const [open, setOpen] = useState(false)

    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleDelete() {
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

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 cursor-pointer">
                    <Trash2 className="size-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this review.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDelete} disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Continue'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}