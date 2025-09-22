// app/components/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// SVG Icons (your existing icons are fine)
const IconBold = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 20h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-2a2 2 0 0 0-2 2v4"/>
    <path d="M14 12h-2a4 4 0 0 0-4 4v4h8"/>
  </svg>
);

const IconItalic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="4" x2="10" y2="4"/>
    <line x1="14" y1="20" x2="5" y2="20"/>
    <line x1="15" y1="4" x2="9" y2="20"/>
  </svg>
);

const IconH1 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20V4"/>
    <path d="M6 12H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"/>
    <path d="M8 12h8"/>
    <path d="M18 12a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2v1"/>
  </svg>
);

const IconH2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v16"/>
    <path d="M14 20v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
    <path d="M10 12h8"/>
  </svg>
);

const IconListBullet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const IconListNumbered = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="10" y1="6" x2="21" y2="6"/>
    <line x1="10" y1="12" x2="21" y2="12"/>
    <line x1="10" y1="18" x2="21" y2="18"/>
    <path d="M4 6h1a2 2 0 0 0 2-2v-1h-3v1a2 2 0 0 0 2 2"/>
    <path d="M3 10a2 2 0 1 0 0 4h1a2 2 0 1 0 0 4h-1"/>
    <path d="M4 20h1a2 2 0 0 0 2-2v-1h-3v1a2 2 0 0 0 2 2"/>
  </svg>
);

const IconLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconUnlink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18.84 10.63a5 5 0 0 0-6.17-6.17l-3.35 3.35a5 5 0 0 0-1.07 5.07"/>
    <path d="M8.3 15.68a5 5 0 0 0 6.17 6.17l3.35-3.35a5 5 0 0 0 1.07-5.07"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const IconBlockquote = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 14h18"/>
    <path d="M3 10a2 2 0 0 1 2-2h2c2.5 0 3.5 2 3.5 4s-1 4-3.5 4h-2a2 2 0 0 1-2-2z"/>
    <path d="M15 10a2 2 0 0 1 2-2h2c2.5 0 3.5 2 3.5 4s-1 4-3.5 4h-2a2 2 0 0 1-2-2z"/>
  </svg>
);

const IconCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function RichTextEditor({ content, onChange, placeholder = 'Write your article content...' }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleLinkSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl.trim()) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  };

  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-xl p-6 min-h-[300px] bg-gray-50 animate-pulse">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-100 rounded-t-xl mb-4">
          {['Bold', 'Italic', 'H1', 'H2', 'List', 'Link'].map((item) => (
            <div key={item} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children,
    title 
  }: { 
    onClick: () => void; 
    isActive: boolean; 
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
      type="button"
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <IconBold />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <IconItalic />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <IconH1 />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <IconH2 />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <IconListBullet />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <IconListNumbered />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <IconBlockquote />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <IconCode />
        </ToolbarButton>

        <div className="flex items-center gap-1 ml-2">
          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
                setLinkUrl('');
              } else {
                setShowLinkInput(true);
              }
            }}
            isActive={editor.isActive('link')}
            title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
          >
            {editor.isActive('link') ? <IconUnlink /> : <IconLink />}
          </ToolbarButton>
          
          {showLinkInput && (
            <form onSubmit={handleLinkSubmission} className="flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 px-3 py-1 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus
              />
              <button 
                type="submit" 
                className="p-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Add Link"
              >
                <IconCheck />
              </button>
              <button 
                type="button" 
                onClick={() => setShowLinkInput(false)} 
                className="p-1 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
                title="Cancel"
              >
                <IconX />
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="p-6 min-h-[300px] bg-white">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none min-h-[200px] focus:outline-none" 
        />
      </div>
      
      {/* Character Count Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
        {editor.getText().length} characters
      </div>
    </div>
  );
}