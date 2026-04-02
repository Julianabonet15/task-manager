import { Task } from '@/lib/api';

const statusStyles: Record<string, string> = {
  not_started: 'bg-gray-100 text-gray-500',
  in_progress: 'bg-blue-100 text-blue-500',
  in_review: 'bg-yellow-100 text-yellow-600',
  done: 'bg-green-100 text-green-600',
  blocked: 'bg-red-100 text-red-400',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-100 text-gray-400',
  medium: 'bg-orange-100 text-orange-400',
  high: 'bg-pink-100 text-pink-500',
  critical: 'bg-red-100 text-red-400',
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
  selected: boolean;
}

export default function TaskCard({ task, onDelete, onClick, selected }: TaskCardProps) {
  return (
    <tr
      onClick={() => onClick(task)}
      className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${selected ? 'bg-gray-50' : 'bg-white'}`}
    >
      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-800">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
        )}
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
          {task.status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-4 py-4 text-xs text-gray-400">
        {task.estimate !== null ? `${task.estimate} pts` : '—'}
      </td>
      <td className="px-4 py-4 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="text-gray-300 hover:text-red-400 transition-colors text-sm"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}