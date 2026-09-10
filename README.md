# FFZ Salas Bot

Bot de Discord que cria salas de Free Fire usando a Nix Salas FF API.

## Passo a passo

1. **Instalar dependências**
   ```
   npm install
   ```

2. **Configurar variáveis de ambiente**
   Renomeie `.env.example` para `.env` e preencha:
   - `DISCORD_TOKEN` — token do bot (Discord Developer Portal)
   - `CLIENT_ID` — ID da aplicação
   - `GUILD_ID` — ID do servidor onde vai testar
   - `NIX_API_KEY` — sua chave da Nix Salas FF API
   - `NIX_API_BASE_URL` — URL base da API (confirme na documentação)

3. **Registrar os comandos**
   ```
   npm run deploy
   ```

4. **Rodar o bot**
   ```
   npm start
   ```

## ⚠️ O que falta ajustar

O arquivo `services/nixApi.js` foi montado com base em uma estrutura REST
"provável" (POST /salas, GET /salas/:id, DELETE /salas/:id). Como a doc da
API não foi confirmada ainda, você precisa:

1. Testar os endpoints reais (Postman/Insomnia/Thunder Client) e conferir:
   - A URL base correta
   - Os nomes exatos dos campos que a API espera (`modo`, `vagas`, `tipo`... podem ter nomes diferentes)
   - O formato da resposta (o que ela devolve: `id`, `senha`, `link`, etc.)
2. Ajustar `criarSala`, `statusSala`, `listarSalas` e `fecharSala` em `services/nixApi.js` pra bater com a API real.

## Comandos disponíveis

- `/criarsala modo vagas [tipo]` — cria uma nova sala
- `/minhasalas` — lista suas salas ativas
- `/fecharsala id` — encerra uma sala específica

## Deploy no Render (Web Service) + UptimeRobot

O bot já sobe um servidor HTTP na porta `8080` (ou na `PORT` que o Render
definir) — isso é o que o Render exige pra classificar como "Web Service" e
o que o UptimeRobot vai pingar pra manter ele acordado.

### 1. Subir o projeto num repositório (GitHub/GitLab)

O Render puxa direto de um repo Git. Suba a pasta pra lá (sem o `.env`, claro).

### 2. Criar o Web Service no Render

1. Vá em **New → Web Service**
2. Conecte o repositório
3. Configurações:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run deploy && npm start`
     *(o `npm run deploy` registra os slash commands toda vez que sobe — se preferir registrar só manualmente, use apenas `npm start`)*
   - **Instance Type:** Free

### 3. Configurar as variáveis de ambiente no Render

Em **Environment → Add Environment Variable**, adicione (mesmos nomes do `.env.example`):

| Key | Valor |
|---|---|
| `DISCORD_TOKEN` | token do bot |
| `CLIENT_ID` | ID da aplicação |
| `GUILD_ID` | ID do servidor |
| `NIX_API_KEY` | sua chave |
| `NIX_API_BASE_URL` | URL base da API |

Não precisa setar `PORT` — o Render injeta essa variável automaticamente.

### 4. Pegar a URL pública do serviço

Depois do deploy, o Render te dá uma URL tipo `https://ffz-salas-bot.onrender.com`.
Acesse ela no navegador — se aparecer "🤖 FFZ Salas Bot está online.", tá funcionando.

### 5. Configurar o UptimeRobot

1. Crie uma conta em uptimerobot.com
2. **Add New Monitor**
   - **Monitor Type:** HTTP(s)
   - **URL:** a URL do Render (ex: `https://ffz-salas-bot.onrender.com`)
   - **Monitoring Interval:** 5 minutos
3. Salve

Isso faz o UptimeRobot bater na URL a cada 5 min, evitando que o Render
coloque o serviço free pra dormir por inatividade.

⚠️ **Free tier do Render ainda tem limite de horas/mês** — o ping evita o
"sleep" por inatividade, mas não contorna o teto de horas caso seu plano
free tenha um. Vale conferir isso no seu painel do Render.

## Próximos passos sugeridos

- Persistir as salas num banco (SQLite/MongoDB) pra vincular sala ↔ dono ↔ canal
- Painel admin (`/admin salas`) restrito por cargo
- Log automático em canal quando uma sala é criada/fechada
