'use client';

import { useState } from 'react';
import { Task, Status, Priority, updateTask } from '@/lib/api';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  in_progress: 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300',
  in_review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  done: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  blocked: 'bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-300',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400',
  medium: 'bg-orange-100 text-orange-400 dark:bg-orange-900 dark:text-orange-300',
  high: 'bg-pink-100 text-pink-500 dark:bg-pink-900 dark:text-pink-300',
  critical: 'bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-300',
};

const statusOptions: Status[] = ['not_started', 'in_progress', 'in_review', 'done', 'blocked'];
const priorityOptions: Priority[] = ['low', 'medium', 'high', 'critical'];

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  onRefresh: () => void;
  selected: boolean;
}

export default function TaskCard({ task, onDelete, onClick, onRefresh, selected }: TaskCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const handleStatusChange = async (status: Status) => {
    setShowStatusMenu(false);
    await updateTask(task.id, { status });
    onRefresh();
  };

  const handlePriorityChange = async (priority: Priority) => {
    setShowPriorityMenu(false);
    await updateTask(task.id, { priority });
    onRefresh();
  };

  return (
    <tr
      onClick={() => onClick(task)}
      className={`border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 group ${selected ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
    >
      <td className="px-4 sm:px-6 py-4">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
        )}
      </td>

      <td className="px-4 py-4 align-middle" onClick={e => e.stopPropagation()}>
        <div className="relative inline-block">
          <button
            onClick={() => setShowStatusMenu(v => !v)}
            className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity ${statusStyles[task.status]}`}
          >
            {task.status.replace(/_/g, ' ')}
          </button>
          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute left-0 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[130px]">
                {statusOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 ${s === task.status ? 'font-medium' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full inline-block ${statusStyles[s].split(' ')[0]}`} />
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>

      <td className="px-4 py-4 align-middle" onClick={e => e.stopPropagation()}>
        <div className="relative inline-block">
          <button
            onClick={() => setShowPriorityMenu(v => !v)}
            className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 transition-opacity ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </button>
          {showPriorityMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPriorityMenu(false)} />
              <div className="absolute left-0 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                {priorityOptions.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300 ${p === task.priority ? 'font-medium' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full inline-block ${priorityStyles[p].split(' ')[0]}`} />
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>

      <td className="hidden sm:table-cell px-4 py-4 text-xs text-gray-400 dark:text-gray-500">
        {task.estimate !== null ? `${task.estimate} pts` : '—'}
      </td>

      <td className="hidden sm:table-cell px-2 sm:px-4 py-4 text-right w-8">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="text-gray-200 dark:text-gray-700 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}