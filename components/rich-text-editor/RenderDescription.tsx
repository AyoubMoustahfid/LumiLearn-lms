"use client"

import { useMemo, useState, useEffect } from "react"
import { type JSONContent } from "@tiptap/react"
import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import parse from "html-react-parser"

export function RenderDescription({ json }: { json: JSONContent }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const output = useMemo(() => {
    if (!isClient) return ""
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      })
    ])
  }, [json, isClient])

  if (!isClient) return null

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  )
}