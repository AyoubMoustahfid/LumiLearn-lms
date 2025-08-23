// app/admin/reviews/_components/ReviewCardStudent.tsx
import Image from "next/image";

interface ReviewCardStudentProps {
  userImage: string | null
  userName: string
  courseName: string
}

export function ReviewCardStudent({ 
  userImage, 
  userName, 
  courseName 
}: ReviewCardStudentProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image
          src={userImage || "/placeholder-avatar.png"}
          alt={userName}
          className="rounded-full"
          width={40}
          height={40}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-sm truncate">
          {userName}
        </h2>
        <p className="text-xs text-muted-foreground truncate mt-1">
          Course: <span className="font-medium">{courseName}</span>
        </p>
      </div>
    </div>
  )
}