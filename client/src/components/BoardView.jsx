import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  return tasks.length === 0 ? (
    <div className="w-full py-4 text-center text-gray-500">
      No tasks available. Create a new task to get started.
    </div>
  ) : (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
      {tasks.map((task, index) => (
        <TaskCard task={task} key={task.id || index} /> 
      ))}
    </div>
  );
};

export default BoardView;
