import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  // Handle Delete Button Click
  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  // Delete Handler Logic (to be implemented)
  const deleteHandler = () => {
    console.log("Delete task with ID:", selected);
    setOpenDialog(false);
  };

  // Render Table Header
  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  // Render Table Row for Each Task
  const TableRow = ({ task }) => {
    const priority = task.priority || "low"; // Default priority
    const formattedDate = task.date ? formatDate(new Date(task.date)) : "N/A"; // Default date

    return (
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
        {/* Task Title */}
        <td className="py-2">
          <div className="flex items-center gap-2">
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
            <p className="w-full line-clamp-2 text-base text-black">{task?.title || "Untitled Task"}</p>
          </div>
        </td>

        {/* Task Priority */}
        <td className="py-2">
          <div className="flex gap-1 items-center">
            <span className={clsx("text-lg", PRIOTITYSTYELS[priority])}>
              {ICONS[priority]}
            </span>
            <span className="capitalize line-clamp-1">
              {priority} Priority
            </span>
          </div>
        </td>

        {/* Task Created At */}
        <td className="py-2">
          <span className="text-sm text-gray-600">{formattedDate}</span>
        </td>

        {/* Task Assets */}
        <td className="py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length || 0}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <MdAttachFile />
              <span>{task?.assets?.length || 0}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <FaList />
              <span>0/{task?.subTasks?.length || 0}</span>
            </div>
          </div>
        </td>

        {/* Task Team Members */}
        <td className="py-2">
          <div className="flex">
            {task?.team?.map((m, index) => (
              <div
                key={m._id || index} // Use unique key or fallback to index
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>

        {/* Action Buttons */}
        <td className="py-2 flex gap-2 md:gap-4 justify-end">
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Edit"
            type="button"
            onClick={() => console.log("Edit task:", task.id)}
          />

          <Button
            className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => deleteClicks(task.id)}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        {tasks.length === 0 ? (
          // Handle Empty Task List
          <div className="w-full text-center text-gray-500 py-4">
            No tasks found. Start by adding a new task.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader />
              <tbody>
                {tasks.map((task) => (
                  <TableRow key={task.id} task={task} /> // Use task.id for key
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;
