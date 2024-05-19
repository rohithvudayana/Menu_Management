import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Category document
export interface CategoryModel extends Document {
  name: string;
  groupType: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax: number;
  taxType?: string;
  subcategories: Schema.Types.ObjectId[]; // Reference to subcategories
  items?: Schema.Types.ObjectId[]; // Reference to items (optional)
}

// Define the schema for Category
const categorySchema = new Schema<CategoryModel>({
  name: { type: String, required: true },
  groupType: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  taxType: { type: String },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "Subcategory", required: false }], // Reference to Subcategory model
  items: [{ type: Schema.Types.ObjectId, ref: "Item", required: false }] // Reference to Item model (optional)
});

// Create the Category model
export const Category = mongoose.model<CategoryModel>("Category", categorySchema);

