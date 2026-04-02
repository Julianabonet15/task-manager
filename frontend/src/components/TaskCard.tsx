import Link from 'next/link';
import { Task } from '@/lib/api';

const statusColors: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
};

export default function TaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tasks/${task.id}`} className="text-base font-semibold text-gray-800 hover:text-blue-600 flex-1">
          {task.title}
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 text-sm shrink-0"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.estimate !== null && (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">
            {task.estimate} pts
          </span>
        )}
      </div>
    </div>
  );
}