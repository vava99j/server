// db.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB_NAME,
  port: 3306
}).promise();

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
  return getPlant(result.insertId); // retorna a planta recém-criada
}


export const result = await getPlants();
  console.log(result);
