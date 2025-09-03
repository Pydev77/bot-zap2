// imports principais
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const { Boom } = require('@hapi/boom'); // Boom da @hapi/boom é a origem
const P = require('pino');
const fs = require('fs');
const readline = require('readline');
const qrterminal = require('qrcode-terminal'); // <-- ADICIONE
const path = require('path');

// Seus utilitários/exports
const {
  colors
} = require('./exports.js');

// ---------- util ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const question = (text) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(text, (answer) => { rl.close(); resolve(answer); });
});

// ---------- flags / paths ----------
const pairingCode = process.argv.includes('sim'); // modo pareamento por código
const folderUserAuth = path.join(__dirname, 'database/qr-code');

// ---------- start ----------
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(folderUserAuth);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    // IMPORTANTE: se for usar QR no terminal, deixe true quando NÃO estiver usando pareamento por código:
    printQRInTerminal: !pairingCode,
    browser: Browsers.macOS('Chrome'), // mais estável para pareamento
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  // 1) PAREAMENTO POR CÓDIGO (executa apenas se não registrado)
  if (pairingCode && !sock.authState.creds?.registered) {
    try {
      let number = await question(colors.red('Digite seu número completo (ex: 5511999999999): '));
      number = (number || '').replace(/\D/g, '');
      if (number.length < 10) {
        console.log(colors.red('❌ Número inválido.'));
        process.exit(1);
      }
      console.log(colors.yellow('🔄 Gerando código de pareamento...'));
      const code = await sock.requestPairingCode(number);
      const formatted = (code || '').match(/.{1,4}/g)?.join('-') || code;
      console.log(colors.green(`✅ Código de pareamento: ${formatted}`));
      console.log(colors.yellow('📱 WhatsApp > Dispositivos conectados > Conectar dispositivo > Digitar código'));
    } catch (err) {
      console.log(colors.red(`❌ Erro ao gerar código: ${err?.message || err}`));
    }
  }

  // 2) EVENTOS DE CONEXÃO (apenas um handler)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !pairingCode) {
      // Se você quiser exibir com qrcode-terminal além do print embutido:
      qrterminal.generate(qr, { small: true });
      console.log(colors.yellow('📷 Aponte a câmera do WhatsApp > Dispositivos conectados.'));
    }

    if (connection === 'connecting') {
      console.log(colors.yellow('🔄 Conectando ao WhatsApp...'));
    }

    if (connection === 'open') {
      console.log(colors.green('✅ Conectado com sucesso!'));
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(colors.yellow('Conexão fechada.'), statusCode);

      if (statusCode === 401) {
        console.log(colors.red('🔐 Credenciais inválidas. Limpando auth e reinicie para parear novamente.'));
        try { fs.rmSync(folderUserAuth, { recursive: true, force: true }); } catch {}
      }

      if (shouldReconnect) {
        setTimeout(start, 3000);
      } else {
        console.log(colors.red('Logout detectado. Encerrando.'));
      }
    }
  });

  // 3) SALVAR CREDENCIAIS
  sock.ev.on('creds.update', saveCreds);

  return sock;
}

// ---------- boot ----------
start().catch(e => console.error(colors.red('• ERROR: ' + e)));
