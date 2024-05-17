import mongoose, { Document, Schema } from "mongoose";
import { Subcategory } from "./subcategory";

export interface CategoryModel extends Document {
  name: string;
  groupType: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax: number;
  taxType?: string;
  subcategories: Schema.Types.ObjectId[];
}

const categorySchema = new Schema<CategoryModel>({
  name: { type: String, required: true },
  groupType:{ type: String, required: true},
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  taxType: { type: String },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory" }],
});

export const Category = mongoose.model<CategoryModel>("Category", categorySchema);
