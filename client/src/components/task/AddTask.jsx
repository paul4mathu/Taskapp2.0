import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList"; // Component for selecting users (team)
import SelectList from "../SelectList";
import Button from "../Button";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITIES = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [team, setTeam] = useState([]); // Track selected team members
  const [stage, setStage] = useState(LISTS[0]); // Default stage
  const [priority, setPriority] = useState(PRIORITIES[2]); // Default priority

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      // Reference Firestore collection for this admin's tasks
      const tasksCollectionRef = collection(db, "admins", user.uid, "tasks");

      // Create task document in Firestore
      await addDoc(tasksCollectionRef, {
        title: data.title,
        description: data.description || "",
        date: data.date,
        stage: stage.toUpperCase(),
        priority: priority.toUpperCase(),
        team, // Include selected team members
        assets: [], // Placeholder for assets
        createdAt: Timestamp.now(),
      });

      console.log("Task successfully added!");
      setOpen(false); // Close modal
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title className="text-base font-bold leading-6 text-gray-900 mb-4">
          Add New Task
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Task title is required!" })}
            error={errors.title ? errors.title.message : ""}
          />

          <Textbox
            placeholder="Task Description"
            type="text"
            name="description"
            label="Task Description"
            className="w-full rounded"
            register={register("description")}
          />

          <Textbox
            placeholder="Task Date"
            type="date"
            name="date"
            label="Task Date"
            className="w-full rounded"
            register={register("date", { required: "Task date is required!" })}
            error={errors.date ? errors.date.message : ""}
          />

          {/* Select Team Members */}
          <UserList team={team} setTeam={setTeam} /> {/* Pass `setTeam` here */}

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
            <SelectList
              label="Priority Level"
              lists={PRIORITIES}
              selected={priority}
              setSelected={setPriority}
            />
          </div>
        </div>

        <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
          <Button
            label="Submit"
            type="submit"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          />
          <Button
            label="Cancel"
            type="button"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
            onClick={() => setOpen(false)}
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
