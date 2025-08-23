import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableReviews } from "./_components/TableReviews";
import { getAllReviews } from "@/app/data/review/get-all-reviews";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { SelectFilter } from "./_components/SelectFilter";


interface ReviewsPageProps {
    searchParams: Promise<{
        course?: string
        month?: string
    }>
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
    const params = await searchParams
    const { course: courseId, month } = params

    const reviews = await getAllReviews({ courseId, month })
    const totalReviews = reviews.length
    const courses = await getAllCourses()

    // Generate months for filter (last 12 months)
    const months = generateMonths()

    return (
        <div className="border border-border rounded-lg">
            <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
                <div className="space-y-1">
                    <h2 className="font-semibold text-md">
                        Reviews from Students
                    </h2>
                    <p className="font-normal text-sm text-muted-foreground">
                        Total reviews <b className="text-foreground font-semibold">{totalReviews}</b>
                        {(courseId || month) && " (filtered)"}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <SelectFilter
                        name="course"
                        placeholder="Filter by course"
                        defaultValue={courseId}
                        options={courses.map(course => ({
                            value: course.id,
                            label: course.title
                        }))}
                    />

                    <SelectFilter
                        name="month"
                        placeholder="Filter by month"
                        defaultValue={month}
                        options={months}
                    />
                </div>
            </div>

            <div>
                <TableReviews reviews={reviews} />
            </div>
        </div>
    )
}


// Helper function to generate month options
function generateMonths() {
    const months = []
    const date = new Date()

    for (let i = 0; i < 12; i++) {
        const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1)
        const value = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
        const label = monthDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })

        months.push({ value, label })
    }

    return months
}