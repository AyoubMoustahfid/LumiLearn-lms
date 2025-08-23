"use client"

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play, Star } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface iAppProps {
    course: CourseSidebarDataType["course"]
}

export function CourseSidebar({ course }: iAppProps) {

    const pathname = usePathname()

    const currentLesosnId = pathname.split("/").pop()

    const { completedLessons, progressPercentage, totalLessons } = useCourseProgress({ courseData: course })


    return (
        <div className="flex flex-col h-full">
            <div className="pb-4 pr-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ">
                        <Play className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-semibold text-base leading-tight truncate">
                            {course.title}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                            {course.category}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                            Progress
                        </span>
                        <span className="font-medium">
                            {completedLessons}/{totalLessons} lessons
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="h-1.5"
                    />
                    <p className="text-xs text-muted-foreground">
                        {progressPercentage}% complete
                    </p>
                </div>
            </div>

            <div className="py-4 pr-4 space-y-3">
                {course.chapter.map((chapter, index) => (
                    <Collapsible
                        key={chapter.id}
                        defaultOpen={index === 0}
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full p-3 h-auto flex items-center gap-2"
                            >
                                <div className="shrink-0">
                                    <ChevronDown className="size-4 text-primary" />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="font-semibold text-sm truncate text-foreground">
                                        {chapter.position} : {chapter.title}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium truncate">
                                        {chapter.lessons.length} lessons
                                    </p>
                                </div>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                            {chapter.lessons.map(lesson => (
                                <LessonItem
                                    lesson={lesson}
                                    key={lesson.id}
                                    slug={course.slug}
                                    isActive={currentLesosnId === lesson.id}
                                    completed={lesson.lessonProgress.find(progress => progress.lessonId === lesson.id)?.completed || false}
                                />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}

                <Collapsible
                    defaultOpen
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="outline"
                            disabled={totalLessons !== completedLessons}
                            className="w-full p-3 h-auto flex items-center gap-2"
                        >
                            <div className="shrink-0">
                                <ChevronDown className="size-4 text-primary" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="font-semibold text-sm truncate text-foreground">
                                    Add review
                                </p>
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                        <Link
                            href={`/dashboard/${course.slug}/${currentLesosnId}?review-course=${course.id}`}
                            className={buttonVariants({
                                variant: "outline",
                                className: cn(
                                    "w-full p-2.5 h-auto justify-start transition-all bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary",
                                )
                            })}
                        >
                            <Star className="size-4 mr-2" />
                            Write a Review
                        </Link>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}