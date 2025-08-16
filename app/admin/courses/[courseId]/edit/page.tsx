
import { adminGetCourse } from "@/app/data/admin/admin-get-course"
import EditCourseClient from "./_components/EditCourseClient"


type Params = Promise<{courseId: string}>

export default async function EditRoute({params}: {params: Params}) {
    const {courseId} = await params
    const data = await adminGetCourse(courseId)

    return <EditCourseClient data={data} />
}