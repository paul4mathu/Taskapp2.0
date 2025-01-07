// src/utils/api.js

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Fetch all tasks
export const fetchTasks = async () => {
  const response = await axios.get(`${BASE_URL}/tasks`);
  return response.data;
};

// Add a new task
export const addTask = async (task) => {
  const response = await axios.post(`${BASE_URL}/tasks`, task);
  return response.data;
};

// Update a task
export const updateTask = async (id, updatedTask) => {
  const response = await axios.put(`${BASE_URL}/tasks/${id}`, updatedTask);
  return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
  return response.data;
};
