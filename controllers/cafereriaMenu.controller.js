import CafeteriaMenu from "../models/CafeteriaMenu.model.js";

// Get menu for a specific day
export const getMenuByDay = async (req, res) => {
  try {
    const menu = await CafeteriaMenu.findOne({ day: req.params.day });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new day menu
export const createMenuForDay = async (req, res) => {
  const { day, breakfast = [], lunch = [], dessert = [] } = req.body;
  try {
    const exists = await CafeteriaMenu.findOne({ day });
    if (exists) return res.status(400).json({ message: "Menu already exists" });

    const menu = await CafeteriaMenu.create({ day, breakfast, lunch, dessert });
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to a category
export const addMenuItem = async (req, res) => {
  const { day, category } = req.params;
  const item = req.body;

  try {
    const menu = await CafeteriaMenu.findOne({ day });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    if (!["breakfast", "lunch", "dessert"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    menu[category].push(item);
    await menu.save();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item
export const updateMenuItem = async (req, res) => {
  const { day, category, itemId } = req.params;
  const { name, protein, calories, image } = req.body;

  try {
    const menu = await CafeteriaMenu.findOne({ day });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const item = menu[category].id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (name !== undefined) item.name = name;

    if (protein !== undefined) {
      if (typeof protein !== 'number' || isNaN(protein)) {
        return res.status(400).json({ message: "Protein must be a number" });
      }
      item.protein = protein;
    }

    if (calories !== undefined) {
      if (typeof calories !== 'number' || isNaN(calories)) {
        return res.status(400).json({ message: "Calories must be a number" });
      }
      item.calories = calories;
    }

    if (image !== undefined) item.image = image;

    await menu.save();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete item
export const deleteMenuItem = async (req, res) => {
  const { day, category, itemId } = req.params;

  try {
    const menu = await CafeteriaMenu.findOne({ day });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    const itemIndex = menu[category].findIndex((i) => i._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    menu[category].splice(itemIndex, 1);
    await menu.save();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
