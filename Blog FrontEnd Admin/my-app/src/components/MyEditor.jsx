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
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { MdOutlineFormatBold, MdFormatItalic, MdOutlineFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify, MdFormatColorText, MdFormatQuote, MdOutlineCode } from "react-icons/md";
import { FaRegImages, FaLink, FaRedo, FaUndo, FaHighlighter, FaStrikethrough } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import handleFileChange from "../ImageHandel/imageHandeler";
import { LuFolderSymlink } from "react-icons/lu";
import { toast } from "react-toastify";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineDrafts } from "react-icons/md";
import Sheduling from "./Sheduling";

// Add CSS for resizable images directly to ensure styles are applied
const imageResizeCSS = `
.ProseMirror img {
  position: relative;
  max-width: 100%;
  height: auto;
}

.ProseMirror .resizable-image-wrapper {
  display: inline-block;
  position: relative;
  margin: 5px;
}

.ProseMirror .resizable-image-wrapper.selected {
  outline: 2px solid #4285f4;
}

.ProseMirror .resizable-image-wrapper .resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #4285f4;
  border-radius: 50%;
}

.ProseMirror .resizable-image-wrapper .resize-handle.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.ProseMirror .resizable-image-wrapper .resize-handle.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.ProseMirror .resizable-image-wrapper .resize-handle.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.ProseMirror .resizable-image-wrapper .resize-handle.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

.ProseMirror .resizable-image-wrapper .move-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: move;
  opacity: 0;
}
`;

// Add style element to document
const addStyleToDocument = () => {
  const styleId = 'tiptap-image-resize-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.innerHTML = imageResizeCSS;
    document.head.appendChild(styleEl);
  }
};

// Enhanced Image extension with better resizing
const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return { height: attributes.height };
        },
      },
      dataPosition: {
        default: null,
        parseHTML: element => element.dataset.position,
        renderHTML: attributes => {
          if (!attributes.dataPosition) {
            return {};
          }
          return { 'data-position': attributes.dataPosition };
        },
      },
    };
  },
});

const MyEditor = ({ setPostsData,setMeta,forSheduling }) => {
  const [uploadImage, setUploadImage] = useState();
  const [compressedImage, setCompressedImage] = useState();
  const [allPreviewImages, setAllPreviewImages] = useState([]); 
  const [allImages, setAllImages] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);


//shedulingTab is handel the sheduling component when this will trigger means open or not
//shedulingTimeDate it take value from the sheduling component and pass it to PostEditor by forSheduling props
const [shedulingTab,setShedulingTab] = useState(false)
  const [shedulingTimeDate,setShedulingTimeDate] = useState()
 
 
  // Save content is the final call means submit the values 
  // forsheduling is coming from there parent postEditor which handel all the logic or all the api works parent name is PostEditor.jsx
  const saveContent = () => {
    if (editor) {
      const content = editor.getHTML();
      forSheduling(shedulingTimeDate);
      setPostsData(content);
      
    } else {
      console.error('Editor is not ready');
    }
  };


//this will check there is any shedule values are seted or not if seted then this will directly set that post for that time 

  useEffect(() => {
    if (shedulingTimeDate !== undefined) { 
      saveContent();
    }
  }, [shedulingTimeDate]);



//handelShedule for open or activate sheduleComponent
function handelShedule(){
  setShedulingTab(true);
}









// all the editor functionality functions are start from here--------------------------------------
  
  






  // Highlight colors array
  const highlightColors = [
    '#FFFF00', // Yellow
    '#FF9900', // Orange
    '#FF6666', // Red
    '#99FF99', // Green
    '#66CCFF', // Blue
    '#CC99FF', // Purple
    '#FF99CC', // Pink
    '#FFFFFF', // White
    '#CCCCCC', // Light Grey
  ];

  // Add CSS styles when component mounts
  useEffect(() => {
    addStyleToDocument();
  }, []);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        heading: true,
      }),
      Link,
      ResizableImageExtension,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Highlight.configure({
        multicolor: true, // Enable multiple colors
      }),
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
    onUpdate: ({ editor }) => {
      // Ensure image wrappers are added to all images
      setupImageResizing(editor.view);
    },
    onTransaction: ({ editor }) => {
      // Update image wrappers when content changes
      setupImageResizing(editor.view);
    },
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      // Set up initial image resizing when editor is ready
      setupImageResizing(editor.view);
      
      // Add click handler to the editor to detect image selections
      const editorElement = document.querySelector('.ProseMirror');
      if (editorElement) {
        editorElement.addEventListener('click', handleEditorClick);
        
        return () => {
          editorElement.removeEventListener('click', handleEditorClick);
        };
      }
    }
  }, [editor]);

  const handleEditorClick = (e) => {
    // Handle click on images for selection
    const allWrappers = document.querySelectorAll('.resizable-image-wrapper');
    allWrappers.forEach(wrapper => {
      wrapper.classList.remove('selected');
    });
    
    // Check if clicked element is an image or its wrapper
    let target = e.target;
    while (target && !target.classList.contains('resizable-image-wrapper')) {
      if (target.tagName === 'IMG') {
        const wrapper = target.closest('.resizable-image-wrapper');
        if (wrapper) {
          wrapper.classList.add('selected');
          e.stopPropagation();
        }
        break;
      }
      target = target.parentElement;
    }
    
    if (target && target.classList.contains('resizable-image-wrapper')) {
      target.classList.add('selected');
      e.stopPropagation();
    }
  };

  // Function to set up image resizing
  const setupImageResizing = (view) => {
    if (!view || !view.dom) return;
    
    // Find all images in the editor
    const images = view.dom.querySelectorAll('img');
    
    // Process each image
    images.forEach(img => {
      // Skip if image is already wrapped
      if (img.parentElement && img.parentElement.classList.contains('resizable-image-wrapper')) {
        return;
      }
      
      // Create wrapper for the image
      const wrapper = document.createElement('div');
      wrapper.classList.add('resizable-image-wrapper');
      
      // Replace the image with the wrapper containing the image
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      // Create resize handles
      const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
      positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.classList.add('resize-handle', pos);
        handle.addEventListener('mousedown', (e) => handleResizeStart(e, img, pos));
        wrapper.appendChild(handle);
      });
      
      // Create move handle
      const moveHandle = document.createElement('div');
      moveHandle.classList.add('move-handle');
      moveHandle.addEventListener('mousedown', (e) => handleMoveStart(e, wrapper));
      wrapper.appendChild(moveHandle);
    });
  };

  // Handle resize start
  const handleResizeStart = (e, img, handlePos) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store initial state
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.width;
    const startHeight = img.height;
    
    // Handle resize move
    const handleResize = (moveEvent) => {
      moveEvent.preventDefault();
      
      // Calculate change in position
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Calculate new dimensions based on which handle was used
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      switch (handlePos) {
        case 'bottom-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'bottom-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'top-right':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'top-left':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
      }
      
      // Ensure minimum size
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      // Update image dimensions
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;
      
      // Update image attributes in the editor
      if (editor) {
        const { state, dispatch } = editor.view;
        const { tr } = state;
        
        state.doc.descendants((node, pos) => {
          if (node.type.name === 'image') {
            const domPos = editor.view.domAtPos(pos);
            let nodeImg = null;
            
            if (domPos.node.tagName === 'IMG') {
              nodeImg = domPos.node;
            } else if (domPos.node.querySelector) {
              nodeImg = domPos.node.querySelector('img');
            }
            
            if (nodeImg === img) {
              tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                width: newWidth,
                height: newHeight
              });
              return false; // Stop traversal once found
            }
          }
          return true;
        });
        
        dispatch(tr);
      }
    };
    
    // Handle resize end
    const handleResizeEnd = () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle move start
  const handleMoveStart = (e, wrapper) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get current position
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Get current transform values or set to 0,0 if none
    const currentTransform = wrapper.style.transform || 'translate(0px, 0px)';
    const match = currentTransform.match(/translate\((-?\d+)px, (-?\d+)px\)/);
    const offsetX = match ? parseInt(match[1], 10) : 0;
    const offsetY = match ? parseInt(match[2], 10) : 0;
    
    // Handle move
    const handleMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      // Calculate new position
      const x = offsetX + (moveEvent.clientX - startX);
      const y = offsetY + (moveEvent.clientY - startY);
      
      // Update wrapper position
      wrapper.style.transform = `translate(${x}px, ${y}px)`;
    };
    
    // Handle move end
    const handleMoveEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMoveEnd);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };

  if (!editor) return null;

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };
  
  // Function to handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if(file.size > 2*1024*1024){
      toast.warn("file size must be smaller then 2MB") ;
      return;
    }
    
    // Convert the file to a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      
      // Add image to the editor
      editor.chain().focus().setImage({ src: imageUrl }).run();
      
      // Optionally store the image for later use
      setAllPreviewImages(prev => [...prev, imageUrl]);
      setAllImages(prev => [...prev, file]);
      
      // Ensure resizing is set up for the new image
      setTimeout(() => {
        setupImageResizing(editor.view);
      }, 100);
    };
    reader.readAsDataURL(file);
  };
  
  // Add Image
  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
      
      // Ensure resizing is set up for the new image
      setTimeout(() => {
        setupImageResizing(editor.view);
      }, 100);
    }
  };
  
  // Add Link
  const addLink = () => {
    const url = prompt('Enter the link URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };
  
  // Apply highlight with selected color
  const applyHighlight = (color) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowColorPicker(false);
  };
  
  // Clear Formatting
  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };



  // Open file browser
  const openFileBrowser = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div initial={{ width: "50%" }} animate={{ width: "" }} className="MyEditorParent">
      
      {
        shedulingTab && <Sheduling setShedulingTab={setShedulingTab} forSheduling={setShedulingTimeDate}/>
      }
      
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

          {/* Highlight with Dropdown */}
          <div style={{ position: 'relative'}}>
            <button 
              onClick={() => setShowColorPicker(!showColorPicker)} 
              className={editor.isActive('highlight') ? 'activeEdit' : ''}
            >
              <FaHighlighter />
            </button>
            
            {showColorPicker && (
              <div 
                style={{
                  position: 'fixed',
                  top: '100%',
                  left: '12%',
                  zIndex: 1000,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '5px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '150px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                {highlightColors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: '25px',
                      height: '25px',
                      backgroundColor: color,
                      margin: '3px',
                      cursor: 'pointer',
                      border: '1px solid #ddd'
                    }}
                    onClick={() => applyHighlight(color)}
                  />
                ))}
              </div>
            )}
          </div>

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
     
          {/* File Upload Image Button */}
          <button onClick={openFileBrowser} style={{ position: 'relative' }}>
            <FaRegImages />
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ 
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }} 
            />
          </button>

          {/* Image from URL */}
          <button onClick={addImage}><LuFolderSymlink /></button>

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
        <button style={{background:"#2eba4ace"}} onClick={()=>{handelShedule()}} className="postButton"><FaRegClock />Shedule</button>
        <button style={{background:"grey"}} className="postButton"><MdOutlineDrafts /> Draft</button>
        <button onClick={()=>{saveContent()}} className="postButton">Post</button>
      </div>
    </motion.div>
  );
};

export default MyEditor;