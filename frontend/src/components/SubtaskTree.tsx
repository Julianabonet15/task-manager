'use client';

import { Task, Status, updateTask, deleteTask } from '@/lib/api';
import { useState } from 'react';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  in_progress: 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300',
  in_review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  done: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  blocked: 'bg-red-100 text-red-400 dark:bg-red-900 dark:text-red-300',
};

const statusOptions: Status[] = ['not_started', 'in_progress', 'in_review', 'done', 'blocked'];

function SubtaskNode({ task, onRefresh }: { task: Task; onRefresh: () => void }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = async (status: Status) => {
    setShowStatusMenu(false);
    await updateTask(task.id, { status });
    onRefresh();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center gap-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 group">
        <div className="relative inline-block">
          <button
            onClick={() => setShowStatusMenu(v => !v)}
            className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 shrink-0 ${statusStyles[task.status]}`}
          >
            {task.status.replace(/_/g, ' ')}
          </button>
          {showStatusMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
              <div className="absolute left-0 top-6 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[130px]">
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
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">{task.title}</p>
          {task.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{task.description}</p>
          )}
        </div>
        {task.estimate !== null && (
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{task.estimate} pts</span>
        )}
        {confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
            <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm shrink-0"
          >
            ✕
          </button>
        )}
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-l border-gray-200 dark:border-gray-700 ml-3 pl-2">
          {task.subtasks.map(sub => (
            <SubtaskNode key={sub.id} task={sub} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubtaskTree({ subtasks, onRefresh }: { subtasks: Task[]; onRefresh: () => void }) {
  if (subtasks.length === 0) return <p className="text-xs text-gray-400 dark:text-gray-500">No subtasks yet.</p>;
  return (
    <div>
      {subtasks.map(task => (
        <SubtaskNode key={task.id} task={task} onRefresh={onRefresh} />
      ))}
    </div>
  );
}