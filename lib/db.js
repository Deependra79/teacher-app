import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "tech_app",
  password: "loldude",
  port: 5432,
});