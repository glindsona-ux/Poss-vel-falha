const axios = require('axios');
require('dotenv').config();

// ⚠️ TODO: confirme a base URL real da API na documentação da Nix Salas FF
const nixApi = axios.create({
  baseURL: process.env.NIX_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.NIX_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

/**
 * Cria uma sala de Free Fire.
 * ⚠️ TODO: ajuste os campos (modo, vagas, tipo, servidor...) conforme a doc real.
 */
async function criarSala({ modo, vagas, tipo, servidor }) {
  try {
    const res = await nixApi.post('/salas', { modo, vagas, tipo, servidor });
    return res.data;
  } catch (err) {
    throw tratarErro(err, 'criar sala');
  }
}

/**
 * Consulta o status de uma sala específica.
 */
async function statusSala(salaId) {
  try {
    const res = await nixApi.get(`/salas/${salaId}`);
    return res.data;
  } catch (err) {
    throw tratarErro(err, 'consultar status da sala');
  }
}

/**
 * Lista salas ativas (opcionalmente filtradas por dono/usuário).
 */
async function listarSalas(donoId) {
  try {
    const res = await nixApi.get('/salas', { params: donoId ? { donoId } : {} });
    return res.data;
  } catch (err) {
    throw tratarErro(err, 'listar salas');
  }
}

/**
 * Encerra/fecha uma sala.
 */
async function fecharSala(salaId) {
  try {
    const res = await nixApi.delete(`/salas/${salaId}`);
    return res.data;
  } catch (err) {
    throw tratarErro(err, 'fechar sala');
  }
}

function tratarErro(err, contexto) {
  const status = err.response?.status;
  const msg = err.response?.data?.message || err.message;
  console.error(`[NixAPI] Erro ao ${contexto}: [${status}] ${msg}`);
  return new Error(`Falha ao ${contexto}: ${msg}`);
}

module.exports = { criarSala, statusSala, listarSalas, fecharSala };

