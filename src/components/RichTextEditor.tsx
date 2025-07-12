import React, { useRef, useState, useEffect } from 'react';
import {
  Bold, Italic, Strikethrough, List, ListOrdered, Link, Image,
  AlignLeft, AlignCenter, AlignRight, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Describe your question in detail..."
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && !showPreview && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, showPreview]);

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => execCommand('bold') },
    { icon: Italic, label: 'Italic', action: () => execCommand('italic') },
    { icon: Strikethrough, label: 'Strikethrough', action: () => execCommand('strikeThrough') },
    { type: 'separator' },
    { icon: List, label: 'Bullet List', action: () => execCommand('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered List', action: () => execCommand('insertOrderedList') },
    { type: 'separator' },
    { icon: AlignLeft, label: 'Align Left', action: () => execCommand('justifyLeft') },
    { icon: AlignCenter, label: 'Align Center', action: () => execCommand('justifyCenter') },
    { icon: AlignRight, label: 'Align Right', action: () => execCommand('justifyRight') },
    { type: 'separator' },
    {
      icon: Link, label: 'Insert Link', action: () => {
        const url = prompt('Enter URL:');
        if (url) execCommand('createLink', url);
      }
    },
    {
      icon: Image, label: 'Insert Image', action: () => {
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          execCommand('insertImage', imageUrl);
        }
      }
    },
    {
      icon: Smile, label: 'Insert Emoji', action: () => {
        const emoji = prompt('Enter Emoji (e.g. 😊):');
        if (emoji && editorRef.current) {
          execCommand('insertText', emoji);
        }
      }
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        {toolbarButtons.map((button, index) =>
          button.type === 'separator' ? (
            <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
          ) : (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white"
              onClick={button.action}
              title={button.label}
            >
{(() => {
  const Icon = button.icon;
  return Icon ? <Icon className="h-4 w-4" /> : null;
})()}
            </Button>
          )
        )}
        <div className="ml-auto">
          <Tabs value={showPreview ? 'preview' : 'write'} onValueChange={(v) => setShowPreview(v === 'preview')}>
            <TabsList className="grid w-fit grid-cols-2 h-8">
              <TabsTrigger value="write" className="text-xs px-3">Write</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs px-3">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Editor Area */}
      <div className="min-h-[200px]">
        {showPreview ? (
          <div className="p-4 prose max-w-none">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview yet...</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              className="p-4 min-h-[200px] outline-none"
              onInput={() => {
                if (editorRef.current) {
                  onChange(editorRef.current.innerHTML);
                }
              }}
              suppressContentEditableWarning
            />
            {(!value || value === '<br>' || value === '<div><br></div>') && (
              <span
                className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none"
                style={{ userSelect: 'none' }}
              >
                {placeholder}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
