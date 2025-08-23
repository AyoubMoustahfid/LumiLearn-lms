// RenderCourses.tsx
import { PublicCourseCard } from "./PublicCourseCard"
import { getCoursesWithReview } from "@/app/data/course/get-course-reviews"

interface RenderCoursesProps {
  category: string
}

export async function RenderCourses({ category }: RenderCoursesProps) {
    const courses = await getCoursesWithReview(category === "all" ? undefined : category)
    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                    No courses found {category !== "all" ? `in category "${category}"` : ""}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Try selecting a different category or check back later for new courses.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <PublicCourseCard
                    data={course}
                    key={course.id}
                />
            ))}
        </div>
    )
}