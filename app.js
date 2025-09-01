import express from 'express';

const app = express();

import { getPlant , getPlants, createPlant } from './db.js';

app.use(express.json());

app.get("/plantas", async(req, res) => {
    const plantas = await getPlants();
    res.send(plantas);
})

app.get("/plantas/:id", async(req, res) => {
    const id = req.params.id;
    const planta = await getPlant(id);
    res.send(planta);
})

app.post("/plantas", async(req, res) => {
    const { usuario_id, horarios, foto_url } = req.body;
    const planta = await createPlant(usuario_id, horarios, foto_url);
    res.status(201).send(planta);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Ocorreu um erro no servidor');
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});