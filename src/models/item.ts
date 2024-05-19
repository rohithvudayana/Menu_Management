import mongoose, { Document, Schema } from "mongoose";

// Define the structure of the Item document
export interface ItemModel extends Document {
  name: string;
  groupType: string;
  image: string;
  description: string;
  price: number;
  taxApplicability: boolean;
  tax: number;
}

// Define the schema for the Item model
const itemSchema = new Schema<ItemModel>({
  name: { type: String, required: true },
  groupType:{ type: String, required: true},
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
});

// Create the Item model using the schema
export const Item = mongoose.model<ItemModel>("Item", itemSchema);
