import "../Css/MyEditor.css";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { GrFormPreviousLink,GrFormNextLink  } from "react-icons/gr";

import { MdOutlineFormatBold, MdFormatItalic, MdOutlineFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify, MdFormatColorText, MdFormatQuote, MdOutlineCode } from "react-icons/md";
import { FaRegImages, FaLink, FaRedo, FaUndo, FaHighlighter, FaStrikethrough } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import handleFileChange from "../ImageHandel/imageHandeler";

const MyEditor = ({setMeta}) => {
   const [uploadImage,setUploadImage] = useState();
   const [compressedImage,setCompressedImage] = useState();
   const [allPreviewImages,setAllPreviewImages] = useState([]); 
   const [allImages,setAllImages] = useState([]); 
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        heading: true,
      }),
      Link,
      Image,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Highlight,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Blockquote,
      CodeBlock,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true })
    ],
    content: '<p>Write your post here</p>',
  });

  if (!editor) return null;




  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };





  



  // 🖼️ Add Image
  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  // 🔗 Add Link
  const addLink = () => {
    const url = prompt('Enter the link URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  // 🧹 Clear Formatting
  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };


  const saveContent = () => {
    if (editor) {
      const content = editor.getHTML()
      console.log('Content:', content)
    } else {
      console.error('Editor is not ready')
    }
  }

  return (
    <motion.div initial={{ width: "50%" }} animate={{ width: "" }} className="MyEditorParent">
      <motion.div initial={{ width: "80%" }} animate={{ width: "" }} className="myEditorBox">
        {/* Toolbar */}
        <motion.div initial={{ top: "-20%" }} animate={{ top: "" }} className="editorOptions" style={{ marginBottom: '10px' }}>
          {/* Bold */}
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'activeEdit' : ''}>
            <MdOutlineFormatBold />
          </button>

          {/* Italic */}
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'activeEdit' : ''}>
            <MdFormatItalic />
          </button>

          {/* Underline */}
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'activeEdit' : ''}>
            <MdOutlineFormatUnderlined />
          </button>

          {/* Strikethrough */}
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'activeEdit' : ''}>
            <FaStrikethrough />
          </button>

          {/* Highlight */}
          <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'activeEdit' : ''}>
            <FaHighlighter />
          </button>

          {/* Bullet List */}
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'activeEdit' : ''}>
            <MdFormatListBulleted />
          </button>

          {/* Ordered List */}
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'activeEdit' : ''}>
            <MdFormatListNumbered />
          </button>

          {/* Headings */}
          {[1, 2, 3].map((level) => (
            <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} className={editor.isActive('heading', { level }) ? 'activeEdit' : ''}>
              H{level}
            </button>
          ))}

          {/* Blockquote */}
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'activeEdit' : ''}>
            <MdFormatQuote />
          </button>

          {/* Code Block */}
          <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'activeEdit' : ''}>
            <MdOutlineCode />
          </button>

          {/* Alignment */}
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}><MdFormatAlignLeft /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()}><MdFormatAlignCenter /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()}><MdFormatAlignRight /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}><MdFormatAlignJustify /></button>
     

     {/* ImageByFile */}
{/*      <button onClick={addImage}><FaRegImages /><input type="file" accept="image/*" onClick={(e)=>{addImageByFile(e)}} /></button>
 */}


          {/* Image */}
          <button onClick={addImage}><FaRegImages /></button>

          {/* Link */}
          <button onClick={addLink}><FaLink /></button>

          {/* Undo/Redo */}
          <button onClick={() => editor.chain().focus().undo().run()}><FaUndo /></button>
          <button onClick={() => editor.chain().focus().redo().run()}><FaRedo /></button>

          {/* Clear Formatting */}
          <button onClick={clearFormatting}>🧹</button>
        </motion.div>

        {/* Editor */}
        <EditorContent className="ProseMirror" editor={editor} />
      </motion.div>
      <div className="editorSubmitBtn">
      <button onClick={()=>{setMeta({})}} className="prevButton"><GrFormPreviousLink /> Prev</button>
        <button onClick={()=>{saveContent()}} className="postButton">Next <GrFormNextLink /></button>
      </div>
    </motion.div>
  );
};

export default MyEditor;
