// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 🔑 Pool de conexão MySQL
const pool = mysql.createPool({
  host: process.env.MYSQLHOST2,        // ex: mysql.railway.internal (Railway) ou ballast.proxy.rlwy.net (local)
  user: process.env.MYSQLUSER2,        // ex: root
  password: process.env.MYSQLPASSWORD2,
  port: process.env.MYSQLPORT2,        // ex: 3306 (Railway) ou 25125 (local público)
  database: process.env.MYSQLDATABASE2,
  ssl: {
    rejectUnauthorized: false,        // necessário porque o proxy do Railway usa SSL
  },
});

export default pool;

// ---- Funções auxiliares ----
export async function getPlant(id) {
  const [rows] = await pool.query(
    "SELECT * FROM plantas WHERE usuario_id = ?",
    [id]
  );
  return rows;
}

export async function getUser(telefone) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE telefone = ?",
    [telefone]
  );
  return rows.length > 0 ? rows[0] : null;
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

export async function createUser(telefone, senha_hash) {
  const [result] = await pool.query(
    "INSERT INTO usuarios (telefone, senha_hash) VALUES (?, ?)",
    [telefone, senha_hash]
  );
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
}

export async function findUser(telefone, senha) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE telefone = ? AND senha_hash = ?",
    [telefone, senha]
  );
  return rows.length > 0 ? rows[0].id : null;
}
