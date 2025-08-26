import { getLessonContent } from "@/app/data/course/get-lesson-content"
import { CourseContent } from "./_components/CourseContent"
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data"
import { getUserReview } from "./actions";
import { ReviewComponent } from "./_components/ReviewCourse";

interface PageProps {
  params: Promise<{ lessonId: string; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LessonContentPage({ params, searchParams }: PageProps) {
  const { lessonId, slug } = await params
  const searchParamsObj = await searchParams
  const reviewCourseId = searchParamsObj['review-course']

  // If review-course parameter exists, show review component
  if (reviewCourseId) {
    const courseData = await getCourseSidebarData(slug)
    const userReview = await getUserReview(reviewCourseId as string)

    return (
      <ReviewComponent 
        courseId={reviewCourseId as string}
        slug={slug}
        initialReview={userReview ? {
          rating: userReview.rating,
          comment: userReview.comment || undefined,
          id: userReview.id
        } : undefined}
        isCourseCompleted={courseData.isCourseCompleted}
      />
    )
  }

  // Otherwise, show normal lesson content
  const data = await getLessonContent(lessonId)
  return <CourseContent data={data} slug={slug} />
}