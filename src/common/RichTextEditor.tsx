"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { LineHeight } from "@/extensions/lineHeight";
import { FontSize } from "@/extensions/fontSize";
import { FontWeight } from "@/extensions/fontWeight";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHighlighter,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaImage,
  FaLink,
  FaUndo,
  FaRedo,
  FaCode,
  FaEraser,
} from "react-icons/fa";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      // <-- Bracket यहां से शुरू होता है
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Bold,
      Italic,
      Underline,
      Highlight,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      HorizontalRule,
      TextStyle,
      Color,
      FontSize,
      LineHeight,
      FontWeight,
      Strike,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your content here…",
      }),
    ], // <-- Bracket यहां बंद होता है
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[320px] px-4 py-3 tiptap-editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active = false) =>
    `px-2 py-1.5 text-sm rounded-md border transition ${
      active
        ? "bg-[#6A38C2] text-white border-[#6A38C2]"
        : "bg-white hover:bg-gray-100"
    }`;

  // Handlers (बिना .focus() के ताकि continuous typing हो सके)
  const handleFontSize = (val: string) => {
    if (val)
      editor
        .chain()
        .setMark("textStyle", { fontSize: `${val}px` })
        .run();
  };

  // Font Weight Handler (अगर फाइल बनाई है तो uncomment करें)
  const handleFontWeight = (val: string) => {
    if (val) editor.chain().setMark("textStyle", { fontWeight: val }).run();
  };

  const handleLineHeight = (val: string) => {
    if (val) {
      editor.chain().updateAttributes("paragraph", { lineHeight: val }).run();
      editor.chain().updateAttributes("heading", { lineHeight: val }).run();
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 px-2 py-2 bg-gray-50 border-b">
        {/* TEXT STYLES */}
        <div className="flex gap-1">
          <button
            type="button"
            className={btn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FaBold />
          </button>
          <button
            type="button"
            className={btn(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FaItalic />
          </button>
          <button
            type="button"
            className={btn(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FaUnderline />
          </button>
        </div>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        {/* FONT SIZE */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400">SIZE</span>
          <input
            type="number"
            min="8"
            placeholder="px"
            className="w-14 px-1 py-1 text-xs border rounded outline-none focus:ring-1 focus:ring-[#6A38C2]"
            onChange={(e) => handleFontSize(e.target.value)}
          />
        </div>

        {/* FONT WEIGHT UI (अगर इस्तेमाल करना है तो uncomment करें) */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400">WGHT</span>
          <input
            type="number"
            min="100"
            max="900"
            step="100"
            placeholder="400"
            className="w-14 px-1 py-1 text-xs border rounded outline-none focus:ring-1 focus:ring-[#6A38C2]"
            onChange={(e) => handleFontWeight(e.target.value)}
          />
        </div>

        {/* LINE HEIGHT (LH) */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-gray-400">LH</span>
          <input
            type="number"
            step="0.1"
            placeholder="1.5"
            className="w-12 px-1 py-1 text-xs border rounded outline-none focus:ring-1 focus:ring-[#6A38C2]"
            onChange={(e) => handleLineHeight(e.target.value)}
          />
        </div>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        {/* HEADINGS */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              type="button"
              className={btn(editor.isActive("heading", { level }))}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as any })
                  .run()
              }
            >
              H{level}
            </button>
          ))}
        </div>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        {/* LISTS */}
        <button
          type="button"
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        {/* ALIGNMENT */}
        <button
          type="button"
          className={btn()}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          className={btn()}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          className={btn()}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <FaAlignRight />
        </button>

        <span className="mx-1 h-5 w-px bg-gray-300" />

        {/* COLOR & UNDO/REDO */}
        <input
          type="color"
          className="w-8 h-8 border rounded cursor-pointer p-0.5"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
        <button
          type="button"
          className={btn()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <FaUndo />
        </button>
        <button
          type="button"
          className={btn()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <FaRedo />
        </button>

        <button
          className={btn(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <FaCode />
        </button>

        <button
          className={btn()}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <FaEraser />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("highlight"))}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <FaHighlighter />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </button>
        <button
          type="button"
          className={btn(editor.isActive("link"))}
          onClick={() => {
            const url = prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <FaLink />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
