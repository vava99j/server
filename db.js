// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  port: Number(dbUrl.port),
});

export async function getUser() {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
}

export async function getPlant(id) {
  const [rows] = await pool.query("SELECT * FROM plantas WHERE id = ?", [id]);
  return rows[0];
}

export async function getPlants() {
  const [rows] = await pool.query("SELECT * FROM plantas");
  return rows;
}

export async function createPlant(usuarioId, horarios, foto_url) {
  const [result] = await pool.query(
    "INSERT INTO plantas (usuario_id, horarios, foto_url) VALUES (?, ?, ?)",
    [usuarioId, horarios, foto_url]
  );
  return getPlant(result.insertId);
}
createPlant(1 , "10 pras 8" , "fotoPLanta")