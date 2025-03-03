import { type Document, Schema, model, models } from "mongoose";

// Interface Category
export interface ICategory extends Document {
  _id: string;
  name: string;
}

// Category Structure Data in MongoDB
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;