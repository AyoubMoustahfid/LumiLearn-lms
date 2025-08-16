"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { EditCourseForm } from "./EditCourseForm"
import { CourseStructur } from "./CourseStructure"
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course"


interface EditCourseClientProps {
  data: AdminCourseSingularType
}

export default function EditCourseClient({ data }: EditCourseClientProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course:
                <span> {data.title} </span>
            </h1>
            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>
                                Provide basic information about the course
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your Course Structure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructur data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}