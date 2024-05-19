import mongoose, { Document, Schema } from "mongoose";

// Interface representing the structure of a Subcategory document
export interface SubcategoryModel extends Document {
  name: string;
  groupType: string;
  image: string;
  description: string;
  taxApplicability: boolean;
  tax: number;
  items: Schema.Types.ObjectId[];
}

// Define the schema for the Subcategory model
const subcategorySchema = new Schema<SubcategoryModel>({
  name: { type: String, required: true }, // Name of the subcategory
  groupType:{ type: String, required: true}, // Type of the group (e.g., category, subcategory)
  image: { type: String, required: true }, // URL of the image
  description: { type: String, required: true }, // Description of the subcategory
  taxApplicability: { type: Boolean, default: false }, // Flag indicating if tax is applicable
  tax: { type: Number, default: 0 }, // Tax rate
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // Array of item IDs associated with the subcategory
});

// Create and export the Subcategory model
export const Subcategory = mongoose.model<SubcategoryModel>("Subcategory", subcategorySchema);
