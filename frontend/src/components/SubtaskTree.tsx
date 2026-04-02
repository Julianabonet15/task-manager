'use client';

import { Task } from '@/lib/api';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-500',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-400',
};

function SubtaskNode({ task, depth = 0 }: { task: Task; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 12 }}>
      <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyles[task.status]}`}>
          {task.status.replace(/_/g, ' ')}
        </span>
        <span className="text-sm text-gray-700 flex-1">{task.title}</span>
        {task.estimate !== null && (
          <span className="text-xs text-gray-400 shrink-0">{task.estimate} pts</span>
        )}
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-l border-gray-200 ml-2">
          {task.subtasks.map(sub => (
            <SubtaskNode key={sub.id} task={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubtaskTree({ subtasks }: { subtasks: Task[] }) {
  if (subtasks.length === 0) return <p className="text-xs text-gray-400">No subtasks yet.</p>;
  return (
    <div>
      {subtasks.map(task => (
        <SubtaskNode key={task.id} task={task} />
      ))}
    </div>
  );
}