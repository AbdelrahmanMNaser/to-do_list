import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../store/slices/taskSlice";
import Card from "../components/ui/Card";
import GraphCard from "../components/dashboard/GraphCard";
import { FaTasks, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Header from "../components/dashboard/Header";
import Plot from "react-plotly.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState("30days");
  const {user} = useSelector((state) => state.user); // Assuming user is stored in auth slice
  const { tasks = [], status } = useSelector((state) => state.tasks || {});
  

  // Load tasks on component mount
  useEffect(() => {
    if (status === "idle" && user) {
      dispatch(fetchTasks(user._id));
    }
  }, [status, dispatch, user]);

  // Calculate task stats directly
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const overdueTasks = tasks.filter((task) => task.status === "pending" && new Date(task.dueDate) < new Date()).length;

  // Prepare data for pie chart
  const pieChartData = {
    labels: ["Completed", "Pending", "Overdue"],
    values: [completedTasks, pendingTasks, overdueTasks],
    colors: ["#10B981", "#FBBF24", "#EF4444"],
  };

  // Prepare data for bar chart based on time range
  // Prepare data for bar chart based on time range
  const getBarChartData = () => {
    // Calculate date ranges based on selected timeRange
    const endDate = new Date();
    let startDate = new Date();
    let interval = "day";
    let format = "%b %d";
  
    switch (timeRange) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(endDate.getMonth() - 3);
        interval = "week";
        format = "%b %d";
        break;
      case "year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        interval = "month";
        format = "%b %Y";
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
  
    // Calculate actual data from tasks array
    const dateLabels = [];
    const completedData = [];
    const pendingData = [];
  
    // Generate date labels based on time range
    const currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      let nextDate = new Date(currentDate);
  
      if (interval === "day") {
        dateLabels.push(currentDate.toLocaleDateString());
  
        // Count tasks by DUE DATE for this day
        const dayCompleted = tasks.filter(
          (task) =>
            task.status === "completed" &&
            new Date(task.dueDate).toDateString() === currentDate.toDateString()
        ).length;
  
        const dayPending = tasks.filter(
          (task) =>
            task.status === "pending" &&
            new Date(task.dueDate).toDateString() === currentDate.toDateString()
        ).length;
  
        completedData.push(dayCompleted);
        pendingData.push(dayPending);
  
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (interval === "week") {
        nextDate.setDate(currentDate.getDate() + 6);
        dateLabels.push(
          `${currentDate.toLocaleDateString()} - ${nextDate.toLocaleDateString()}`
        );
  
        // Count tasks for this week
        const weekCompleted = tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return (
            task.status === "completed" &&
            dueDate >= currentDate &&
            dueDate <= nextDate
          );
        }).length;
  
        const weekPending = tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return (
            task.status === "pending" &&
            dueDate >= currentDate &&
            dueDate <= nextDate
          );
        }).length;
  
        completedData.push(weekCompleted);
        pendingData.push(weekPending);
  
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (interval === "month") {
        dateLabels.push(
          currentDate.toLocaleDateString("default", {
            month: "short",
            year: "numeric",
          })
        );
  
        // Get last day of month
        nextDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
  
        // Count tasks for this month by due date
        const monthCompleted = tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return (
            task.status === "completed" &&
            dueDate.getMonth() === currentDate.getMonth() &&
            dueDate.getFullYear() === currentDate.getFullYear()
          );
        }).length;
  
        const monthPending = tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return (
            task.status === "pending" &&
            dueDate.getMonth() === currentDate.getMonth() &&
            dueDate.getFullYear() === currentDate.getFullYear()
          );
        }).length;
  
        completedData.push(monthCompleted);
        pendingData.push(monthPending);
  
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
  
    return {
      dates: dateLabels,
      completed: completedData,
      pending: pendingData,  // renamed from "created" for clarity
    };
  };

  const barData = getBarChartData();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks
            .filter(
              (task) =>
                task.status === "pending" &&
                new Date(task.dueDate) >= new Date()
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3)
            .map((task) => (
              <Card
                key={task.id}
                padding="normal"
                className="bg-white"
                variant="interactive"
              >
                <h3 className="font-medium mb-2">{task.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
