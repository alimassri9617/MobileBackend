// constants.js
export const Majors = [
  "Computer Science",
  "Computer Engineering",
  "Accounting",
  "Sports Training",
  "Dental Lab",
];
export const Subjects = [
  "Oral and Written Communication - COMM001",
  "Data Structures and Algorithms - SYS332",
  "Web Development 2 - SYS554",
  "Accounting and finance - BUS112",
  "Nutrituin - SPO451",
];
export const Departments = [
  "Computer and Communications Engineering",
  "Business",
  "Sports Sciences",
  "Public Health",
  "Administration",
];

export const BADGES = [
  {
    id: "starter",
    name: "Focus Initiate",
    description: "Completed 5 Pomodoros",
    threshold: 5,
  },
  {
    id: "amateur",
    name: "Task Climber",
    description: "Completed 20 Pomodoros",
    threshold: 20,
  },
  {
    id: "pro",
    name: "Flow Achiever",
    description: "Completed 50 Pomodoros",
    threshold: 50,
  },
  {
    id: "master",
    name: "Deep Work Devotee",
    description: "Completed 100 Pomodoros",
    threshold: 100,
  },
  {
    id: "weekend_machine",
    name: "Weekend Warrior",
    description: "Completed a Pomodoro session on the weekend",
    // weekend sessions have no threshold; handled by condition
    condition: (session) => {
      const day = new Date(session.timestamp).getDay(); // 0 = Sunday, 6 = Saturday
      return day === 0 || day === 6;
    },
  },
];
