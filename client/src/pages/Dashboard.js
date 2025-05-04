import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Plot from "react-plotly.js";
import { FaTasks, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

import { fetchTasks } from "../store/slices/taskSlice";
import  getBarChartData  from "../utils/BarChartData";

import Card from "../components/ui/Card";
import GraphCard from "../components/dashboard/GraphCard";
import Header from "../components/dashboard/Header";
import TaskCard from "../components/task/TaskCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState("30days");
  const { user } = useSelector((state) => state.user);
  const { tasks = [], status } = useSelector((state) => state.tasks || {});

  // Load tasks on component mount
  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchTasks(user._id));
    }
  }, [status, dispatch, user]);

  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const overdueTasks = tasks.filter(
    (task) => task.status === "pending" && new Date(task.dueDate) < new Date()
  ).length;

  // Prepare data for pie chart
  const pieChartData = {
    labels: ["Completed", "Pending", "Overdue"],
    values: [completedTasks, pendingTasks, overdueTasks],
    colors: ["#10B981", "#FBBF24", "#EF4444"],
  };

  const barData = getBarChartData(tasks, timeRange);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <Header username={user.username} />

      {/* Summary Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Tasks */}
        <Card padding="normal" className="bg-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaTasks className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold">{totalTasks}</p>
            </div>
          </div>
        </Card>

        {/* Completed Tasks */}
        <Card padding="normal" className="bg-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaCheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">{completedTasks}</p>
              <p className="text-xs text-green-600">
                {Math.round((completedTasks / totalTasks) * 100) || 0}%
                completion rate
              </p>
            </div>
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card padding="normal" className="bg-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <FaExclamationTriangle className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold">{pendingTasks}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <GraphCard
          type="pie"
          title="Task Status Distribution"
          subtitle="Overview of your tasks by status"
        >
          <Plot
            data={[
              {
                type: "pie",
                values: pieChartData.values,
                labels: pieChartData.labels,
                marker: {
                  colors: pieChartData.colors,
                },
                textinfo: "label+percent",
                hoverinfo: "label+percent",
              },
            ]}
            layout={{
              height: 400,
              showlegend: true,
              legend: { orientation: "h", y: -0.1 },
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%" }}
          />
        </GraphCard>

        {/* Bar Chart */}
        <GraphCard
          type="bar"
          title="Task Completion Trend"
          subtitle="Your completed tasks over time"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        >
          <Plot
            data={[
              {
                type: "bar",
                x: barData.dates,
                y: barData.created,
                name: "Pending",
                marker: { color: "#60A5FA" },
              },
              {
                type: "bar",
                x: barData.dates,
                y: barData.completed,
                name: "Completed",
                marker: { color: "#10B981" },
              },
            ]}
            layout={{
              height: 300,
              margin: { t: 10, r: 10, b: 40, l: 40 },
              legend: { orientation: "h", y: 1.1 },
              barmode: "group",
              xaxis: { fixedrange: true },
              yaxis: { fixedrange: true, title: "Tasks" },
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%" }}
          />
        </GraphCard>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="flex flex-col gap-4 w-7/12">
          {tasks
            .filter(
              (task) =>
                task.status === "pending" &&
                new Date(task.dueDate) >= new Date()
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3)
            .map((task) => (
              // Display only the first 3 upcoming tasks using TaskCard component

              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
