import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 4321;

export const connectionString = process.env.CONNECTION_STRING;
