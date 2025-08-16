"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Menubar } from "./Menubar"
import TextAlign from "@tiptap/extension-text-align"

export function RichTextEditor({field}: {field: any}) {
    const editor = useEditor({
        extensions: [StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            })
        ],
        // 👇 This avoids hydration mismatch in SSR
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert min-h-[300px] p-4 focus:outline-none !w-full !max-w-none",
            },
        },
        // 👇 Add this line to fix the SSR issue
        immediatelyRender: false,
        onUpdate: ({editor}) => {
            field.onChange(JSON.stringify(editor.getJSON()))
        },
        content: field.value ? JSON.parse(field.value): '<p>Hello World</p>'
    })

    if (!editor) return null // optional: handle editor not ready

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
