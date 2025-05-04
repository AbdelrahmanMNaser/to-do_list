const getBarChartData = (  tasks, timeRange) => {
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

export default getBarChartData;