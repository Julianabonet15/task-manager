import { Stats } from '@/lib/api';

export default function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-100 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500">Not Started</p>
        <p className="text-2xl font-bold text-gray-800">{stats.notStarted}</p>
        <p className="text-xs text-gray-400">est. points</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-500">In Progress</p>
        <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
        <p className="text-xs text-blue-300">est. points</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <p className="text-sm text-purple-500">Total Estimate</p>
        <p className="text-2xl font-bold text-purple-700">{stats.totalEstimate}</p>
        <p className="text-xs text-purple-300">est. points</p>
      </div>
    </div>
  );
}