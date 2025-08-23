// FilterByCategory.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { courseCategories } from "@/lib/zodSchemas"

type Props = {
  value: string
}

export function FilterByCategory({ value }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newCategory === "all") {
      params.delete("category")
    } else {
      params.set("category", newCategory)
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Select value={value} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {courseCategories.map(category => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}