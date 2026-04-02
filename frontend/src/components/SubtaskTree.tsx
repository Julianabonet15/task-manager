'use client';

import Link from 'next/link';
import { Task } from '@/lib/api';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-600',
};

function SubtaskNode({ task, depth = 0 }: { task: Task; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 16 }} className="mt-2">
      <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <Link href={`/tasks/${task.id}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 flex-1">
          {task.title}
        </Link>
        {task.estimate !== null && (
          <span className="text-xs text-purple-500">{task.estimate} pts</span>
        )}
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-l-2 border-gray-200 ml-3">
          {task.subtasks.map(sub => (
            <SubtaskNode key={sub.id} task={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubtaskTree({ subtasks }: { subtasks: Task[] }) {
  if (subtasks.length === 0) return <p className="text-sm text-gray-400">No subtasks yet.</p>;
  return (
    <div>
      {subtasks.map(task => (
        <SubtaskNode key={task.id} task={task} />
      ))}
    </div>
  );
}