import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  protein: { type: Number, required: true, min: 0 },
  calories: { type: Number, required: true, min: 0 },
  image: { type: String, required: true }, // Assume URL validation client-side
});

const cafeteriaMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    breakfast: [menuItemSchema],
    lunch: [menuItemSchema],
    dessert: [menuItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CafeteriaMenu", cafeteriaMenuSchema);
