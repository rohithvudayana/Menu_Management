import mongoose, { Document, Schema } from "mongoose";
import { Item } from "./item";

interface SubcategoryModel extends Document {
  name: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax: number;
  items: Schema.Types.ObjectId[];
}

const subcategorySchema = new Schema<SubcategoryModel>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

export const Subcategory = mongoose.model<SubcategoryModel>("Subcategory", subcategorySchema);
