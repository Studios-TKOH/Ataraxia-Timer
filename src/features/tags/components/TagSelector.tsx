import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagIcon, ChevronDown, Check, Trash2, Edit2, X } from 'lucide-react';
import { useTags } from '@/features/tags/hooks/useTags';
import { TEXTS } from '@/shared/constants/texts.constants';
import { motion, AnimatePresence } from 'framer-motion';

interface TagSelectorProps {
    selectedTagId: string | null;
    onSelectTag: (tagId: string | null) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagId, onSelectTag }) => {
    const { tags, removeTag, updateTag } = useTags();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [tagToDelete, setTagToDelete] = useState<{ id: string; name: string; color?: string } | null>(null);

    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [editingTagName, setEditingTagName] = useState('');

    // Encontramos el tag seleccionado para mostrar su nombre y color en el botón
    const selectedTag = tags.find(t => t.id === selectedTagId);

    // Cierra el menú si el usuario hace clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const startEdit = (tag: any) => {
        setEditingTagId(tag.id);
        setEditingTagName(tag.name);
    };

    const cancelEdit = () => {
        setEditingTagId(null);
        setEditingTagName('');
    };

    const saveEdit = async (id: string) => {
        if (editingTagName.trim().length >= 2) {
            await updateTag(id, { name: editingTagName.trim() });
        }
        setEditingTagId(null);
        setEditingTagName('');
    };

    return (
        <>
        <div className="relative w-full" ref={dropdownRef}>
            {/* BOTÓN PRINCIPAL (Actúa como el Select) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center gap-3 bg-black/40 hover:bg-black/60 px-4 py-3 border border-white/5 focus-within:border-white/10 rounded-2xl w-full transition-all group"
            >
                <div className="flex items-center gap-3">
                    <TagIcon className="text-white/20" size={14} />
                    {selectedTag ? (
                        <div className="flex items-center gap-2">
                            <div
                                className="shadow-[0_0_8px] shadow-current rounded-full w-2 h-2"
                                style={{
                                    color: selectedTag.color || '#5fbfff',
                                    backgroundColor: selectedTag.color || '#5fbfff'
                                }}
                            />
                            <span className="font-bold text-white/80 text-xs uppercase tracking-widest">
                                {selectedTag.name}
                            </span>
                        </div>
                    ) : (
                        <span className="font-bold text-white/20 text-xs uppercase tracking-widest">
                            {TEXTS.tags.selectCategory}
                        </span>
                    )}
                </div>
                <ChevronDown
                    size={14}
                    className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* LISTA DESPLEGABLE (Opciones) */}
            {isOpen && (
                <div className="z-50 absolute flex flex-col gap-1 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl mt-2 p-2 border border-white/10 rounded-2xl w-full max-h-48 overflow-y-auto custom-scrollbar">

                    {/* Opción para quitar el tag (Ninguno) */}
                    <button
                        type="button"
                        onClick={() => { onSelectTag(null); setIsOpen(false); }}
                        className="flex justify-between items-center hover:bg-white/5 px-3 py-2.5 rounded-xl transition-colors"
                    >
                        <span className="font-bold text-white/30 text-xs uppercase tracking-widest">
                            {TEXTS.tags.noCategory}
                        </span>
                        {!selectedTagId && <Check size={14} className="text-white/30" />}
                    </button>

                    {/* Mapeo de Tags del usuario */}
                    {tags.map((tag) => {
                        const isSelected = selectedTagId === tag.id;
                        const isEditing = editingTagId === tag.id;

                        return (
                            <div
                                key={tag.id}
                                className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition-colors group/item ${
                                    isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                                }`}
                            >
                                {isEditing ? (
                                    <div className="flex flex-1 items-center gap-2 min-w-0" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={editingTagName}
                                            onChange={(e) => setEditingTagName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    saveEdit(tag.id);
                                                } else if (e.key === 'Escape') {
                                                    cancelEdit();
                                                }
                                            }}
                                            className="flex-1 bg-transparent py-0.5 border-b border-[#00ffd5] outline-none font-bold text-white text-xs uppercase tracking-widest min-w-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => saveEdit(tag.id)}
                                            className="p-1 text-[#00ffd5] shrink-0 hover:scale-110 transition-transform"
                                        >
                                            <Check size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="p-1 text-white/20 hover:text-white/60 shrink-0 hover:scale-110 transition-transform"
                                        >
                                            <X size={13} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onSelectTag(tag.id);
                                                setIsOpen(false);
                                            }}
                                            className="flex flex-1 items-center gap-3 text-left py-1 min-w-0 cursor-pointer"
                                        >
                                            <div
                                                className="shadow-[0_0_8px] shadow-current rounded-full w-2 h-2 shrink-0"
                                                style={{
                                                    color: tag.color || '#5fbfff',
                                                    backgroundColor: tag.color || '#5fbfff'
                                                }}
                                            />
                                            <span className="font-bold text-white/80 text-xs uppercase tracking-widest truncate">
                                                {tag.name}
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-0.5 opacity-100 sm:group-hover/item:opacity-100 sm:opacity-0 transition-all shrink-0 ml-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEdit(tag);
                                                }}
                                                className="p-1 text-white/20 hover:text-[#00ffd5] hover:scale-115 transition-all cursor-pointer"
                                                title="Edit Tag"
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTagToDelete({ id: tag.id, name: tag.name, color: tag.color });
                                                }}
                                                className="p-1 text-white/20 hover:text-red-500 hover:scale-115 transition-all cursor-pointer"
                                                title="Delete Tag"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>

                                        {isSelected && (
                                            <Check size={14} className="text-[#00ffd5] shrink-0 ml-2" />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
        <AnimatePresence>
            {tagToDelete && (
                <div className="z-[110] fixed inset-0 flex justify-center items-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setTagToDelete(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-red-500/20 rounded-[2rem] w-full max-w-sm overflow-hidden glass"
                    >
                        <div 
                            className="h-1.5 w-full shrink-0" 
                            style={{
                                background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #000 10px, #000 20px)'
                            }}
                        />

                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-3 text-[10px] tracking-[0.2em] font-mono text-red-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                SYS.DESTROY_TAG
                            </div>

                            <h3 className="mb-4 font-black text-2xl text-white tracking-tight leading-none">
                                Confirm Deletion
                            </h3>

                            <div className="flex items-center gap-3 bg-black/40 p-4 border border-white/5 rounded-2xl mb-6">
                                <div 
                                    className="w-3 h-3 rounded-full shadow-[0_0_12px_currentColor]"
                                    style={{ 
                                        color: tagToDelete.color || '#5fbfff',
                                        backgroundColor: tagToDelete.color || '#5fbfff' 
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-white/30 font-mono tracking-wider uppercase">Category to delete</div>
                                    <div className="font-bold text-white text-xs tracking-widest uppercase truncate">
                                        {tagToDelete.name}
                                    </div>
                                </div>
                            </div>

                            <p className="mb-8 font-bold text-white/50 text-[10px] uppercase leading-relaxed tracking-widest">
                                Deleting this category will untag all associated objectives. This action is permanent.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setTagToDelete(null)}
                                    className="flex-1 py-3.5 border border-white/10 hover:border-white/20 rounded-xl font-black text-white/60 hover:text-white text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeTag(tagToDelete.id);
                                        if (selectedTagId === tagToDelete.id) {
                                            onSelectTag(null);
                                        }
                                        setTagToDelete(null);
                                    }}
                                    className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 rounded-xl font-black text-white text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        </>
    );
};

export default TagSelector;