import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit2, GripVertical, Check, X } from 'lucide-react';

export function TaskItem({ task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(task.id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(task.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        style={style}
        className="flex items-center gap-2 p-3 mb-3 rounded-2xl bg-white shadow-lg border border-gray-100"
      >
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="flex-1 bg-transparent border-b border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-blue-500 pb-1"
        />
        <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors">
          <Check size={18} />
        </button>
        <button onClick={handleCancel} className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>
    );
  }

  // Random mock tag for design fidelity
  const tags = [
    { label: 'Urgente', bg: 'bg-red-100', text: 'text-red-700' },
    { label: 'Escuela', bg: 'bg-blue-100', text: 'text-blue-700' },
    { label: 'Personal', bg: 'bg-green-100', text: 'text-green-700' },
    { label: 'Trabajo', bg: 'bg-purple-100', text: 'text-purple-700' },
  ];
  // Stable random based on content length to avoid jitter
  const tagIndex = task.content.length % tags.length;
  const tag = tags[tagIndex];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-center gap-3 p-4 mb-3 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors"
      >
        <GripVertical size={18} />
      </div>

      {/* Visual Checkbox */}
      <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors cursor-pointer" />

      <span className="flex-1 text-sm font-medium text-gray-700 break-words leading-relaxed">
        {task.content}
      </span>

      {/* Tag */}
      <div className={`hidden sm:block px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tag.bg} ${tag.text}`}>
        {tag.label}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
