import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Importa o middleware cors
dotenv.config();

import { getPlant, getPlants, createPlant, createUser } from './db.js';

const app = express();

app.use(cors()); // Permite CORS para todas as origens (ajuste depois para produção)
app.use(express.json());

app.get("/plantas", async (req, res, next) => {
  try {
    const [plantas] = await getPlants();
    res.send(plantas);
  } catch (err) {
    next(err);
  }
});

app.get("/plantas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const planta = await getPlant(id);
    res.send(planta);
  } catch (err) {
    next(err);
  }
});

app.post("/plantas", async (req, res, next) => {
  try {
    const { usuario_id, horarios, foto_url } = req.body;
    const planta = await createPlant(usuario_id, horarios, foto_url);
    res.status(201).send(planta);
  } catch (err) {
    next(err);
  }
});

app.post("/usuarios", async (req, res, next) => {
  try {
    const { telefone, senha_hash } = req.body;
    const user = await createUser(telefone, senha_hash);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro no servidor');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
