"use client"

import { AdminQuizType } from "@/app/data/admin/admin-get-quiz";
import { SingleQuizDisplay } from "./SingleQuizDisplay";


interface iAppProps {
  data: AdminQuizType[]; // now an array
  lessonId: string;
  courseId: string
}

export function QuizDisplay({ data, lessonId, courseId }: iAppProps) {
  return (
    <>
      {data.map((quiz, i) => (
        <SingleQuizDisplay key={i} data={quiz} lessonId={lessonId} courseId={courseId} />
      ))}
    </>
  );
}