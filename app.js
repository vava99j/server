import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getPlant, getPlants, createPlant, createUser, findUser } from './db.js';

dotenv.config();

const app = express();

// ✅ Middleware de erro global (primeiro)
app.use((err, req, res, next) => {
  console.error("🔥 Erro no servidor:", err.message);
  res.status(500).json({ error: err.message });
});

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// ✅ Captura erros não tratados
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  console.error(promise);
  process.exit(1);
});

// ✅ Teste de conexão com o banco (opcional, mas recomendado)
async function testDB() {
  try {
    const [rows] = await getPlants();
    console.log('✅ Banco de dados acessível!');
  } catch (err) {
    console.error('❌ Falha ao conectar ao banco:', err.message);
    console.error('URL usada:', process.env.DATABASE_URL);
    process.exit(1);
  }
}

// Rotas de plantas e usuários
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

// ✅ Rota de login
app.post("/login", async (req, res) => {
  const { telefone, senha_hash } = req.body;

  try {
    const userId = await findUser(telefone, senha_hash);

    if (!userId) {
      return res.status(401).json({ error: "Telefone ou senha inválidos" });
    }

    res.json({ id: userId });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ✅ Rota de saúde (ANTES do app.listen!)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// ✅ Servidor escuta na porta correta
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Servidor rodando na porta ${port}`);
  
  // Testa o banco após o servidor iniciar
  await testDB();
});