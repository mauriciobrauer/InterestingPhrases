import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskItem } from './TaskItem';

export function DayColumn({ date, tasks, onAddTask, onDeleteTask, onEditTask, isFeatured = false }) {
    const [newTaskContent, setNewTaskContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Use the date string as the unique identifier for the droppable area
    const dateStr = date.toISOString();
    const { setNodeRef } = useDroppable({
        id: dateStr,
        data: { type: 'Column', date: dateStr } // Helper data
    });

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskContent.trim()) {
            onAddTask(date, newTaskContent);
            setNewTaskContent('');
            // Keep adding mode open for rapid entry if desired, or close it. 
            // Let's keep it open for "Today" maybe? Or just clear it.
            // For mobile-like experience, maybe close it. Let's keep it simple.
            setIsAdding(false);
        }
    };

    const dayName = format(date, 'EEEE', { locale: es });
    const dayNumber = format(date, 'd', { locale: es });
    const monthName = format(date, 'MMMM', { locale: es });
    const isCurrentDay = isToday(date);

    return (
        <div
            ref={setNodeRef}
            className={`
        flex flex-col
        transition-all duration-300
        ${isFeatured ? 'pb-8' : 'pb-4'}
      `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
                <h2 className={`font-bold capitalize ${isFeatured ? 'text-2xl text-gray-900' : 'text-lg text-gray-800'}`}>
                    {isCurrentDay ? 'Hoy' : dayName}
                </h2>

                {isFeatured && (
                    <span className="text-2xl">📅</span>
                )}
                {!isFeatured && isCurrentDay === false && (
                    <span className="text-gray-400 text-sm font-medium capitalize">
                        {dayName === 'mañana' ? '☀️' : ''}
                    </span>
                )}
            </div>

            {/* Tasks List */}
            <div className="flex-1 flex flex-col gap-1 min-h-[50px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={onDeleteTask}
                            onEdit={onEditTask}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 py-3 px-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors w-full text-sm font-medium"
                    >
                        <Plus size={16} />
                        <span>Agregar tarea</span>
                    </button>
                )}
            </div>

            {/* Add Task Area */}
            {isAdding ? (
                <form onSubmit={handleAddTask} className="mt-2 relative">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Escribe una tarea..."
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        onBlur={() => !newTaskContent && setIsAdding(false)}
                        className="w-full p-4 pr-12 rounded-2xl bg-white shadow-lg shadow-blue-500/5 ring-1 ring-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </form>
            ) : (
                tasks.length > 0 && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                    >
                        <Plus size={16} />
                        <span>Nueva actividad</span>
                    </button>
                )
            )}
        </div>
    );
}
