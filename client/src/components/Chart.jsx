import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { db } from "../firebase"; // Firebase Firestore configuration
import { collection, onSnapshot } from "firebase/firestore";

export const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Reference to the tasks collection for the logged-in admin
    const tasksRef = collection(db, "admins", user.uid, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => doc.data());

      // Count tasks by stage
      const taskCounts = fetchedTasks.reduce(
        (acc, task) => {
          if (task.stage === "TODO") acc.todo += 1;
          if (task.stage === "IN PROGRESS") acc.inProgress += 1;
          if (task.stage === "COMPLETED") acc.completed += 1;
          return acc;
        },
        { todo: 0, inProgress: 0, completed: 0 }
      );

      // Update chart data
      setChartData([
        { name: "To Do", total: taskCounts.todo },
        { name: "In Progress", total: taskCounts.inProgress },
        { name: "Completed", total: taskCounts.completed },
      ]);
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [user]);

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
