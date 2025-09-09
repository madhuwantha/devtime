import { useEffect, useState } from "react";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { GetWorkTimeSummary, GetIdleTimeSummary, GetProjectTimeSummary, GetTaskTimeSummary, GetProductivitySummary, GetPeakProductivityHours } from "../../wailsjs/go/main/App";
import { entity } from "../../wailsjs/go/models";

export default function Analytics() {
  const [groupBy, setGroupBy] = useState("daily");

  const [workSummary, setWorkSummary] = useState<entity.WorkSummary[]>([]);
  const [idleSummary, setIdleSummary] = useState<entity.IdleSummary[]>([]);
  const [projectSummary, setProjectSummary] = useState<entity.ProjectSummary[]>([]);
  const [taskSummary, setTaskSummary] = useState<entity.TaskSummary[]>([]);
  const [productivitySummary, setProductivitySummary] = useState<entity.ProductivitySummary[]>([]);
  const [peakHours, setPeakHours] = useState<entity.PeakHourSummary[]>([]);

  // Fetch all analytics data
  const fetchData = async () => {
    setWorkSummary(await GetWorkTimeSummary(groupBy));
    setIdleSummary(await GetIdleTimeSummary(groupBy));
    setProjectSummary(await GetProjectTimeSummary(groupBy));
    setTaskSummary(await GetTaskTimeSummary(groupBy));
    setProductivitySummary(await GetProductivitySummary(groupBy));
    setPeakHours(await GetPeakProductivityHours());
  };

  useEffect(() => {
    fetchData();
  }, [groupBy]);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-400">📊 Analytics Dashboard</h1>

        {/* Group By Filter */}
        <select
          className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Work Time Chart */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">⏳ Total Work Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={workSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="Date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="TotalHours" stroke="#00e6e6" strokeWidth={3} />
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
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📂 Time Spent per Project</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectSummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="ProjectName" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="HoursSpent" fill="#00c2ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task Summary Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Time Spent per Task</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-slate-700 text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-2 border border-slate-700">Task</th>
                <th className="px-4 py-2 border border-slate-700">Project</th>
                <th className="px-4 py-2 border border-slate-700">Period</th>
                <th className="px-4 py-2 border border-slate-700">Hours</th>
              </tr>
            </thead>
            <tbody>
              {taskSummary.map((task, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2 border border-slate-700">{task.task_name}</td>
                  <td className="px-4 py-2 border border-slate-700">{task.project_name}</td>
                  <td className="px-4 py-2 border border-slate-700">{task.period}</td>
                  <td className="px-4 py-2 border border-slate-700">{task.hours_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productivity % Chart */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📈 Productivity Percentage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productivitySummary}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="Date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ProductivityPercent" stroke="#00ff99" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours Bar Chart */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">⏰ Peak Productivity Hours</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHours}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="Hour" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="HoursSpent" fill="#ff9900" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
