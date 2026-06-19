"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePageContent } from '@/components/providers/PageContentProvider';
import axios from 'axios';
import { Edit3, Check, X, Loader2 } from 'lucide-react';

interface LiveEditProps {
  id: string;
  defaultText: string | React.ReactNode;
  as?: any;
  className?: string;
  multiline?: boolean;
}

export function LiveEdit({ id, defaultText, as: Component = 'span', className = '', multiline = false }: LiveEditProps) {
  const { contents, updateContentLocally, isAdmin } = usePageContent();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // The content exists in the provider, otherwise fallback to defaultText
  const currentContent = contents[id] !== undefined ? contents[id] : (typeof defaultText === 'string' ? defaultText : '');
  const [editValue, setEditValue] = useState(currentContent);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Update edit value when content changes remotely
  useEffect(() => {
    setEditValue(currentContent);
  }, [currentContent]);

  // Focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === currentContent) {
      setIsEditing(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post('/api/page-content', {
        section_key: id,
        content: editValue
      });
      if (res.data.success) {
        updateContentLocally(id, editValue);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(currentContent);
    setIsEditing(false);
  };

  // If not admin, just render normally
  if (!isAdmin) {
    // If it's the very first render and we don't have it in context, show default
    if (contents[id] === undefined && typeof defaultText !== 'string') {
      return <Component className={className}>{defaultText}</Component>;
    }
    return <Component className={className} dangerouslySetInnerHTML={{ __html: currentContent || defaultText }} />;
  }

  // Admin Mode
  return (
    <div className={`relative group inline-block w-full ${isEditing ? 'z-50' : ''}`}>
      {isEditing ? (
        <div className="relative bg-white/95 backdrop-blur shadow-2xl rounded-xl p-3 border-2 border-emerald-500 animate-in zoom-in-95 duration-200">
          <div className="absolute -top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            EDITING: {id}
          </div>
          {multiline ? (
            <textarea
              ref={inputRef as any}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[100px] p-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-base"
              placeholder="Masukkan teks..."
            />
          ) : (
            <input
              ref={inputRef as any}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-base"
              placeholder="Masukkan teks..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
            />
          )}
          <div className="flex justify-end gap-2 mt-3">
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Batal
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1 transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Simpan
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="relative rounded hover:ring-2 hover:ring-emerald-400 hover:ring-dashed transition-all cursor-text group-hover:bg-emerald-50/10"
        >
          {/* Edit Badge Overlay */}
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
            <Edit3 className="w-3 h-3" />
          </div>
          
          <Component className={className} dangerouslySetInnerHTML={{ __html: currentContent || defaultText }} />
        </div>
      )}
    </div>
  );
}
