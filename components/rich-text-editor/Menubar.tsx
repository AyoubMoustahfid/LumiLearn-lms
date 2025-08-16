"use client"

import { type Editor } from "@tiptap/react"
import { TooltipTrigger, TooltipProvider, Tooltip, TooltipContent } from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1Icon, Heading2Icon, Heading3Icon, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"


interface iAppProps {
    editor: Editor | null
}

export function Menubar({ editor }: iAppProps) {

    if (!editor) {
        return null
    }

    return (
        <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <div className="flex flex-wrap">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                                size="sm"
                                pressed={editor.isActive("bold")}
                                className={cn(
                                    editor.isActive("bold") && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                size="sm"
                                pressed={editor.isActive("italic")}
                                className={cn(
                                    editor.isActive("italic") && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                size="sm"
                                pressed={editor.isActive("strike")}
                                className={cn(
                                    editor.isActive("strike") && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                size="sm"
                                pressed={editor.isActive("heading", { level: 1 })}
                                className={cn(
                                    editor.isActive("heading", { level: 1 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading1Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                size="sm"
                                pressed={editor.isActive("heading", { level: 2 })}
                                className={cn(
                                    editor.isActive("heading", { level: 2 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading2Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                size="sm"
                                pressed={editor.isActive("heading", { level: 3 })}
                                className={cn(
                                    editor.isActive("heading", { level: 3 }) && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <Heading3Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                size="sm"
                                pressed={editor.isActive("bulletList")}
                                className={cn(
                                    editor.isActive("bulletList") && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                size="sm"
                                pressed={editor.isActive("orderedList")}
                                className={cn(
                                    editor.isActive("orderedList") && 'bg-muted text-muted-foreground'
                                )}
                            >
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Ordered List</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2"></div>

                                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                    size="sm"
                                    pressed={editor.isActive({ textAlign: 'left' })}
                                    className={cn(
                                        editor.isActive({ textAlign: 'left' }) && 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <AlignLeft />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align Left</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                    size="sm"
                                    pressed={editor.isActive({ textAlign: 'center' })}
                                    className={cn(
                                        editor.isActive({ textAlign: 'center' }) && 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <AlignCenter />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align Center</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                    size="sm"
                                    pressed={editor.isActive({ textAlign: 'right' })}
                                    className={cn(
                                        editor.isActive({ textAlign: 'right' }) && 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <AlignRight />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align Right</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="w-px h-6 bg-border mx-2"></div>

                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => editor.chain().focus().undo().run()}
                                    disabled={!editor.can().undo()}
                                >
                                    <Undo/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => editor.chain().focus().redo().run()}
                                    disabled={!editor.can().redo()}
                                >
                                    <Redo/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo</TooltipContent>
                        </Tooltip>
                    </div>
            </TooltipProvider>
        </div>
    )
}