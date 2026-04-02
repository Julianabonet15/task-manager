import { Stats } from '@/lib/api';

const cards = [
  { key: 'notStarted' as keyof Stats, label: 'Not Started', color: 'text-gray-600 dark:text-gray-300' },
  { key: 'inProgress' as keyof Stats, label: 'In Progress', color: 'text-blue-500' },
  { key: 'inReview' as keyof Stats, label: 'In Review', color: 'text-yellow-600' },
  { key: 'done' as keyof Stats, label: 'Done', color: 'text-green-600' },
  { key: 'blocked' as keyof Stats, label: 'Blocked', color: 'text-red-400' },
];

export default function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map(card => (
        <div key={card.key} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1 truncate">{card.label}</p>
          <p className={`text-2xl font-semibold ${card.color}`}>{stats[card.key]}</p>
        </div>
      ))}
    </div>
  );
}