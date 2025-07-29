import Todo from "../models/todo.model.js";
import notificationService from "../utils/NotificationService.js";

const SYSTEM_SENDER_ID = process.env.SYSTEM_SENDER_ID;

function combineDateAndTime(date, timeStr) {
  // date is a Date object, timeStr is "HH:mm"
  const [hours, minutes] = timeStr.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

export const sendTodoReminders = async () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  // Fetch all todos that are not completed
  const todos = await Todo.find({ completed: false });

  // Filter todos whose end datetime is within 1 minute window around oneHourLater
  const todosToNotify = todos.filter(todo => {
    if (!todo.date || !todo.endTime) return false;
    const todoEndDateTime = combineDateAndTime(todo.date, todo.endTime);
    return todoEndDateTime >= oneHourLater && todoEndDateTime < new Date(oneHourLater.getTime() + 60 * 1000);
  });

  for (const todo of todosToNotify) {
    const message = `Reminder: Your todo "${todo.title}" is ending in 1 hour.`;
    const data = {
      todoId: todo._id,
      endTime: todo.endTime,
    };

    await notificationService.notifyUsers({
      recipients: [todo.userId],
      sender: SYSTEM_SENDER_ID,
      type: "reminder",
      message,
      data,
    });
  }
};
