import { useEffect, useState } from "react";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { GetWorkTimeSummary, GetIdleTimeSummary, GetProjectTimeSummary, GetTaskTimeSummary, GetProductivitySummary, GetPeakProductivityHours } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";

export default function Analytics() {
  const [groupBy, setGroupBy] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);

  const [workSummary, setWorkSummary] = useState<entity.WorkSummary[]>([]);
  const [idleSummary, setIdleSummary] = useState<entity.IdleSummary[]>([]);
  const [projectSummary, setProjectSummary] = useState<entity.ProjectSummary[]>([]);
  const [taskSummary, setTaskSummary] = useState<entity.TaskSummary[]>([]);
  const [productivitySummary, setProductivitySummary] = useState<entity.ProductivitySummary[]>([]);
  const [peakHours, setPeakHours] = useState<entity.PeakHourSummary[]>([]);

  useEffect(()=>{
    console.log("workSummary",workSummary)
  },[workSummary])

  // Fetch all analytics data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      setWorkSummary(await GetWorkTimeSummary(groupBy));
      setIdleSummary(await GetIdleTimeSummary(groupBy));
      setProjectSummary(await GetProjectTimeSummary(groupBy));
      setTaskSummary(await GetTaskTimeSummary(groupBy));
      setProductivitySummary(await GetProductivitySummary(groupBy));
      setPeakHours(await GetPeakProductivityHours());
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mb-4 animate-pulse">
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-slate-400 text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Analytics Dashboard</h2>
          <p className="text-slate-400">Track your productivity and work patterns</p>
        </div>

        {/* Group By Filter */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="appearance-none px-4 pr-8 py-3 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm text-slate-200 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Work Time Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <span className="text-lg">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Total Work Time</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={workSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f1f5f9'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total_hours" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Idle Time Chart */}
      {/* <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">💤 Total Idle Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={idleSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="Date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="IdleHours" stroke="#ff6666" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* Project Time Bar Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span className="text-lg">📂</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Time Spent per Project</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="project_name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f1f5f9'
              }}
            />
            <Bar 
              dataKey="hours_spent" 
              fill="url(#projectGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task Summary Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-lg">📝</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Time Spent per Task</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-slate-300 font-medium text-sm uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-slate-300 font-medium text-sm uppercase tracking-wider">Project</th>
                <th className="px-4 py-3 text-slate-300 font-medium text-sm uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-slate-300 font-medium text-sm uppercase tracking-wider">Hours</th>
              </tr>
            </thead>
            <tbody>
              {taskSummary.map((task, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                  <td className="px-4 py-3 text-slate-200 font-medium">{task.task_name}</td>
                  <td className="px-4 py-3 text-slate-400">{task.project_name}</td>
                  <td className="px-4 py-3 text-slate-400">{task.period}</td>
                  <td className="px-4 py-3 text-cyan-400 font-semibold">{task.hours_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productivity % Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-lg">📈</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Productivity Percentage</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productivitySummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f1f5f9'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="productivity_percent" 
              stroke="#a855f7" 
              strokeWidth={3}
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours Bar Chart */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            <span className="text-lg">⏰</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Peak Productivity Hours</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHours}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#f1f5f9'
              }}
            />
            <Bar 
              dataKey="hours_spent" 
              fill="url(#peakGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
