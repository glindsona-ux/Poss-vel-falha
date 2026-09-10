const express = require('express');

function startKeepAliveServer() {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.get('/', (req, res) => {
    res.status(200).send('🤖 FFZ Salas Bot está online.');
  });

  app.listen(PORT, () => {
    console.log(`🌐 Servidor keep-alive rodando na porta ${PORT}`);
  });
}

module.exports = { startKeepAliveServer };
