const { 'default': makeWASocket, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, WAGroupMetadata, relayWAMessage,   MediaPathMap, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, fetchLatestBaileysVersion, MessageRetryMap, extractGroupMetadata, generateWAMessageFromContent, proto, otherOpts, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');

const { fs, Boom, axios, crypto, util, P, linkfy, request, cheerio, ms, exec, moment, time, hora, date, getBuffer, fetchJson, getBase64, upload, banner2, banner3, colors, getGroupAdmins } = require('./exports.js');

const { menu, anotacao, menudono, adms, menulogos, efeitos, menuprem, brincadeiras, infodono, alteradores, destrava, destrava2, tabela, conselhob, palavrasc, ban, joguinhodavelhajs, joguinhodavelhajs2, nescessario, setting, logoslink, premium, countMessage, sendVideoAsSticker, sendImageAsSticker, sendVideoAsSticker2, sendImageAsSticker2, sotoy, daily, comandos, limitefll, antispam, anotar, getRandom, NodeCache,insert, response } = require('./exports.js');

const { NomeDoBot, NickDono, numerodono , prefix, } = require("./settings/settings.json");


var { fundo1, fundo2 } = require("./settings/links_img.json");

const sleep = async (ms) => {return new Promise(resolve => setTimeout(resolve, ms))};

function DLT_FL(file) {
try { fs.unlinkSync(file) } catch (error) {}
}

const kontol_info2 = console.info;
console.info = function() { 
if(!util.format(...arguments).includes("Closing session: SessionEntry")){ 
return kontol_info2(...arguments); 
}};

const kontol_info1 = console.info;
console.info = function() { 
if(!util.format(...arguments).includes("Removing old closed session: SessionEntry {}")){
return kontol_info1(...arguments);
}};

const msgRetryCounterCache = new NodeCache();

const readline = require("readline");

const pairingCode = process.argv.includes("sim");
let rl;
const question = (text) => new Promise((resolve) => {
  if (rl && !rl.closed) {
    rl.close();
  }
  rl = readline.createInterface({input: process.stdin, output: process.stdout});
  rl.question(text, (answer) => {
    rl.close();
    resolve(answer);
  });
});

async function iniciargbmorelost() {
var folderUserAuth = "./database/qr-code";

const { state, saveCreds } = await useMultiFileAuthState(folderUserAuth);

const { version, isLatest } = await fetchLatestBaileysVersion();

const gbmorelost = makeWASocket({
  version,
  auth: state,
  syncFullHistory: false,
  printQRInTerminal: !pairingCode,
  qrTimeout: 60000,
  logger: P({ level: 'silent' }),
  browser: ['Takira Bot', 'Desktop', '1.0.0'],
  msgRetryCounterCache,
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 20000,
  keepAliveIntervalMs: 30000,
  emitOwnEvents: true,
  fireInitQueries: false,
  generateHighQualityLinkPreview: true,
  markOnlineOnConnect: false,
  shouldSyncHistoryMessage: () => false,
  getMessage: async () => undefined,
  patchMessageBeforeSending: (message) => {
  const requiresPatch = !!(message.buttonsMessage || message.listMessage);
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
         message: {messageContextInfo: {
          deviceListMetadataVersion: 2,
          deviceListMetadata: 
          {},
       }, 
       ...message}}}}
   return message;
}
});

const PhoneNumber = require('awesome-phonenumber')


// Handle pairing code - moved to connection event
let pairingAttempted = false;

// Handle connection updates
gbmorelost.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
  if (qr && !pairingCode) {
    console.log(colors.cyan('QR Code gerado! Escaneie com o WhatsApp.'));
  }
  
  if (connection === 'connecting') {
    console.log(colors.yellow('🔄 Conectando ao WhatsApp...'));
  }
  
  if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    console.log(colors.yellow('Conexão fechada devido a'), lastDisconnect?.error, colors.yellow('Reconectando...'), shouldReconnect);
    
    if (shouldReconnect) {
      setTimeout(() => {
        iniciargbmorelost();
      }, 3000);
    }
  }
  
  if (connection === 'open') {
    console.log(colors.green('✅ Conectado com sucesso ao WhatsApp!'));
    
    // Handle pairing code after successful connection
    if (pairingCode && !gbmorelost.authState.creds.registered && !pairingAttempted) {
      pairingAttempted = true;
      console.log(colors.cyan('⏳ Aguardando estabilização da conexão...'));
      
      try {
        // Wait longer for connection to stabilize
        await sleep(5000);
        
        let number = await question(`${colors.red("Agora você vai precisar colar seu número aqui ou digitar, precisa do número todo até o 55 ou código do país")}${colors.cyan("\n• Clica na tela e em (paste) para colar o número: ")}`);
        number = number.replace(/[^0-9]/g, "");
        
        // Validate phone number
        if (!number || number.length < 10) {
          console.log(colors.red("Número inválido! Por favor, insira um número válido."));
          return;
        }
        
        console.log(colors.yellow('🔄 Gerando código de pareamento...'));
        
        // Multiple attempts to get pairing code
        let code;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts && !code) {
          try {
            attempts++;
            console.log(colors.cyan(`Tentativa ${attempts}/${maxAttempts}...`));
            code = await gbmorelost.requestPairingCode(number);
            
            if (code) {
              code = code?.match(/.{1,4}/g)?.join("-") || code;
              console.log(`${colors.green("✅ Código de pareamento gerado com sucesso!")}`);
              console.log(`${colors.cyan("📱 Seu código: ")}${colors.white.bold(code)}`);
              console.log(colors.yellow('📖 Como usar:'));
              console.log(colors.yellow('1. Abra o WhatsApp no seu celular'));
              console.log(colors.yellow('2. Vá em "Dispositivos Conectados"'));
              console.log(colors.yellow('3. Toque em "Conectar um dispositivo"'));
              console.log(colors.yellow('4. Digite o código acima'));
              console.log(colors.green('⏰ Você tem 20 segundos para inserir o código!'));
              break;
            }
          } catch (err) {
            console.log(colors.red(`❌ Erro na tentativa ${attempts}: ${err.message}`));
            if (attempts < maxAttempts) {
              console.log(colors.yellow('⏳ Aguardando 3 segundos antes da próxima tentativa...'));
              await sleep(3000);
            }
          }
        }
        
        if (!code) {
          console.log(colors.red('❌ Falha ao gerar código após todas as tentativas'));
          console.log(colors.yellow('🔄 Reiniciando conexão...'));
          setTimeout(() => {
            iniciargbmorelost();
          }, 5000);
        }
        
      } catch(error) {
        console.error(colors.red('❌ Erro no processo de pareamento:'), error.message);
        console.log(colors.yellow("🔄 Tentando reconectar em 5 segundos..."));
        setTimeout(() => {
          iniciargbmorelost();
        }, 5000);
      }
    }
  }
});

gbmorelost.ev.process(async(events) => {
if(events["group-participants.update"]){
try {
var sab2 = events["group-participants.update"];
if(!fs.existsSync(`./database/grupos/activation_gp/${sab2.id}.json`)) return
var jsonGp = JSON.parse(fs.readFileSync(`./database/grupos/activation_gp/${sab2.id}.json`));

if(sab2.participants[0].startsWith(gbmorelost.user.id.split(':')[0])) return;

try { var grpmdt = await gbmorelost.groupMetadata(sab2.id) } catch (e) { return }

const isGroup2 = grpmdt.id.endsWith('@g.us');

try {
var GroupMetadata_ = isGroup2 ? await gbmorelost.groupMetadata(sab2.id): ""} catch (e) {return}

const membros_ = isGroup2 ? GroupMetadata_.participants : '';
const groupAdmins_ = isGroup2 ? getGroupAdmins(membros_) : '';

if(sab2.action == 'add'){
num = sab2.participants[0];
if(nescessario.listanegraG.includes(num)){
await gbmorelost.sendMessage(GroupMetadata_.id,{text: 'Takira..'});
gbmorelost.groupParticipantsUpdate(GroupMetadata_.id, [sab2.participants[0]], 'remove');
return;
}}
if(sab2.action == 'remove'){
num = sab2.participants[0];
}
if(sab2.action == 'add' && jsonGp[0].listanegra.includes(sab2.participants[0])){
await gbmorelost.sendMessage(GroupMetadata_.id,{text: 'Takira...'});
gbmorelost.groupParticipantsUpdate(GroupMetadata_.id, [sab2.participants[0]], 'remove');
}
if(jsonGp[0].antifake && sab2.action === 'add' && !sab2.participants[0].startsWith(55)){
if(jsonGp[0].legenda_estrangeiro != "0") {
await gbmorelost.sendMessage(GroupMetadata_.id, {text: jsonGp[0].legenda_estrangeiro});
}
setTimeout(async() => {
gbmorelost.groupParticipantsUpdate(GroupMetadata_.id, [sab2.participants[0]], 'remove');
}, 1000);
}


if(!jsonGp[0].wellcome[1].bemvindo2 && !jsonGp[0].wellcome[0].bemvindo1) return;
try {
var mdata_2 = isGroup2 ? await gbmorelost.groupMetadata(sab2.id): "";
} catch (e) {
return;
}
const isWelcomed = jsonGp[0].wellcome[0].legendabv != null ? true : false;
const isByed = jsonGp[0].wellcome[0].legendasaiu != 0 ? true : false;
const isWelcomed2 = jsonGp[0].wellcome[1].legendabv != null ? true : false;
const isByed2 = jsonGp[0].wellcome[1].legendasaiu != 0 ? true : false;
const groupDesc = await mdata_2.desc;
if(jsonGp[0].antifake == true && !sab2.participants[0].startsWith(55)) return;
if(jsonGp[0].wellcome[0].bemvindo1 == true){


try {
ppimg = await gbmorelost.profilePictureUrl(sab2.participants[0]);
} catch(e) {
ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg';
}
try {
ppgp = await gbmorelost.profilePictureUrl(mdata_2.id);
} catch(e) {
ppgp = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg';
}
shortpc = await axios.get(`https://tinyurl.com/api-create.php?url=${ppimg}`);

if(sab2.action === 'add') {

if(isWelcomed) {
teks = jsonGp[0].wellcome[0].legendabv
.replace('#hora#', time)
.replace('#nomedogp#', mdata_2.subject)
.replace('#numerodele#', '@'+sab2.participants[0].split('@')[0])
.replace('#numerobot#', gbmorelost.user.id)
.replace('#prefixo#', jsonGp[0].multiprefix == true ? jsonGp[0].prefixos[0] : setting.prefix)
.replace('#descrição#', groupDesc);
} else {
teks = welcome(sab2.participants[0].split('@')[0], mdata_2.subject);
}
let buff = await getBuffer(ppimg);
ran = getRandom('.jpg');
await fs.writeFileSync(ran, buff);
let ranBV = [
`Takira`];
gbmorelost.sendMessage(mdata_2.id, { image: { url: `&username=${NomeDoBot}`}, 
caption: teks,
mentions: sab2.participants});
DLT_FL(ran);
} else if(sab2.action === 'remove') {
mem = sab2.participants[0];
try {
ppimg = await gbmorelost.profilePictureUrl(`${mem.split('@')[0]}@c.us`);
} catch (e){
ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg';
}

if(isByed) {
teks = jsonGp[0].wellcome[0].legendasaiu
.replace('#hora#', time)
.replace('#nomedogp#', mdata_2.subject)
.replace('#numerodele#', pushname)
.replace('#numerobot#', gbmorelost.user.id)
.replace('#prefixo#', jsonGp[0].multiprefix == true ? jsonGp[0].prefixos[0] : setting.prefix)
.replace('#descrição#', groupDesc);
} else {
teks = bye(pushname);
}

let buff = await getBuffer(ppimg)
ran = getRandom('.jpg')
fs.writeFileSync(ran, buff)
const ranSI = [
`das `];
gbmorelost.sendMessage(mdata_2.id, { image: { url: ``}, 
caption: teks,
mentions: sab2.participants});
DLT_FL(ran);
}
}
  
if(jsonGp[0].wellcome[1].bemvindo2 == true){
if(sab2.action === 'add') {
if(isWelcomed2) {
teks = jsonGp[0].wellcome[1].legendabv
.replace('#hora#', time)
.replace('#nomedogp#', mdata_2.subject)
.replace('#numerodele#', sab2.participants[0].split('@')[0])
.replace('#numerobot#', gbmorelost.user.id)
.replace('#prefixo#', jsonGp[0].multiprefix == true ? jsonGp[0].prefixos[0] : setting.prefix)
.replace('#descrição#', groupDesc)
} else {
teks = welcome2(sab2.participants[0].split('@')[0], mdata_2.subject)
}
gbmorelost.sendMessage(mdata_2.id, {text: teks, mentions: sab2.participants})
} else if(sab2.action === 'remove') {
var mem = sab2.participants[0]

if(isByed2) {
teks = jsonGp[0].wellcome[1].legendasaiu
.replace('#hora#', time)
.replace('#nomedogp#', mdata_2.subject)
.replace('#numerodele#', mem.split('@')[0])
.replace('#numerobot#', gbmorelost.user.id)
.replace('#prefixo#', jsonGp[0].multiprefix == true ? jsonGp[0].prefixos[0] : setting.prefix)
.replace('#descrição#', groupDesc)
} else {
teks = bye2(mem.split('@')[0])
}
gbmorelost.sendMessage(mdata_2.id, {
    image: { url: ppimg },
    caption: teks,
    mentions: sab2.participants
  });
DLT_FL(ran)
}
}
} catch (e) {
console.log(e)
}
}

if(events["messages.upsert"]) {
var upsert = events["messages.upsert"]
require("./index.js")(upsert, gbmorelost)
}

if(events["connection.update"]) {
const update = events["connection.update"]; 
var { connection, lastDisconnect, qr, isNewLogin, receivedPendingNotifications } = update  
if(qr) {
  console.log(colors.green("Tire foto do qr code com outro celular e com o que vc quer usar o bot vc acessa pelo whatsapp em dispositivos conectados.."))
}  

const shouldReconnect = new Boom(lastDisconnect?.error)?.output.statusCode

switch (connection) {
case 'close':
if(shouldReconnect) {
if(shouldReconnect == 428) {
console.log(colors.yellow("[Error: 428] - Conexão fechou, vou tentar de novo, se der merda é por que a sua Net tá muito lenta..."));
} else if(shouldReconnect == 401) {
exec("cd database && rm -rf qr-code")
console.log(colors.red("A autenticação com WhatsApp Web falhou! Por favor, reinicie e realize a autenticação novamente."))
} else if(shouldReconnect == 515) {
console.log(colors.gray("\nA autenticação foi bem sucedida! Restart necessário para estabilizar a conexão."))
} else if(shouldReconnect == 440) {
console.log(colors.gray("Ta ocorrendo um erro , se vc tentar ligar e acontecer mais 2 ou 3 vezes , creio que haja um outro bot ligado no seu número..."))
} else if(shouldReconnect == 503) {
console.log(colors.grey("Ocorreu um erro desconhecido ao executar o bot novamente ou sua primeira inicialização."));
} else if(shouldReconnect == 502) {
console.log(colors.grey("internet  querendo cair..."))
} else if(shouldReconnect == 408) {
console.log(colors.gray(" Conexão fraca..."))
} else {
console.log(colors.yellow(`A conexão com o zap fechou pois: ${lastDisconnect?.error}`))
};
iniciargbmorelost();
}
break;

case 'connecting':
console.log(colors.yellow(`Estou conectando em 1,2,3... - ${date} ${time}`))
break;

case 'open':
console.log(banner3.string)   
console.log(banner2.string)  
console.log(colors.green(`❄️lombradao bot v1.0 Já conseguiu conectar...❄️\n`))
await gbmorelost.sendPresenceUpdate("available")
await gbmorelost.updateProfileStatus(`Olá, sou um bot não mandem mensagem!`)
break;

default:
break
}}

if(events["creds.update"]) {await saveCreds()};
require("./index.js")(gbmorelost, folderUserAuth);
})}

iniciargbmorelost().catch(async(e) => {console.log(colors.red("• ERROR: "+e))})