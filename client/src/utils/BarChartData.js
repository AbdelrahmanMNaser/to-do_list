const getBarChartData = (tasks, timeRange) => {
  // Calculate date ranges based on selected timeRange
  const endDate = new Date();
  let startDate = new Date();
  let interval = "day";

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
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      interval = "month";
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  // Initialize arrays for date labels and data
  const dateLabels = [];
  const completedData = [];
  const createdData = [];

  // Generate date points based on time range
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    let nextDate = new Date(currentDate);

    if (interval === "day") {
      // Format date as MM/DD/YYYY for better readability
      dateLabels.push(currentDate.toLocaleDateString());

      // Count tasks CREATED on this day
      const dayCreated = tasks.filter(
        (task) => {
          const createdDate = new Date(task.createdAt);
          return createdDate.toDateString() === currentDate.toDateString();
        }
      ).length;

      // Count tasks COMPLETED on this day
      const dayCompleted = tasks.filter(
        (task) => {
          if (!task.completedAt) return false;
          const completedDate = new Date(task.completedAt);
          return completedDate.toDateString() === currentDate.toDateString();
        }
      ).length;

      completedData.push(dayCompleted);
      createdData.push(dayCreated);

      currentDate.setDate(currentDate.getDate() + 1);
    } else if (interval === "week") {
      nextDate.setDate(currentDate.getDate() + 6);
      
      // Format date range as "Start - End" for weeks
      dateLabels.push(
        `${currentDate.getMonth()+1}/${currentDate.getDate()} - ${nextDate.getMonth()+1}/${nextDate.getDate()}`
      );

      // Count tasks CREATED in this week
      const weekCreated = tasks.filter((task) => {
        const createdDate = new Date(task.createdAt);
        return createdDate >= currentDate && createdDate <= nextDate;
      }).length;

      // Count tasks COMPLETED in this week
      const weekCompleted = tasks.filter((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return completedDate >= currentDate && completedDate <= nextDate;
      }).length;

      completedData.push(weekCompleted);
      createdData.push(weekCreated);

      currentDate.setDate(currentDate.getDate() + 7);
    } else if (interval === "month") {
      // Format as "Month Year"
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

      // Count tasks CREATED in this month
      const monthCreated = tasks.filter((task) => {
        const createdDate = new Date(task.createdAt);
        return (
          createdDate.getMonth() === currentDate.getMonth() &&
          createdDate.getFullYear() === currentDate.getFullYear()
        );
      }).length;

      // Count tasks COMPLETED in this month
      const monthCompleted = tasks.filter((task) => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return (
          completedDate.getMonth() === currentDate.getMonth() &&
          completedDate.getFullYear() === currentDate.getFullYear()
        );
      }).length;

      completedData.push(monthCompleted);
      createdData.push(monthCreated);

      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return {
    dates: dateLabels,
    completed: completedData,
    created: createdData,  // Return created tasks count (not pending)
  };
};

export default getBarChartData;