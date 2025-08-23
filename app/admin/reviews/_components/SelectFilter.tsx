"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface SelectFilterProps {
  name: string
  placeholder: string
  defaultValue?: string
  options: { value: string; label: string }[]
}

export function SelectFilter({ name, placeholder, defaultValue, options }: SelectFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue || "")

  useEffect(() => {
    setValue(defaultValue || "")
  }, [defaultValue])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (newValue) {
      params.set(name, newValue)
    } else {
      params.delete(name)
    }
    
    router.push(`/admin/reviews?${params.toString()}`)
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}