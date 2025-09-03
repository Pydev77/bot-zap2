const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

// Utility functions for the bot
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

const generateMessageID = () => {
    return crypto.randomBytes(10).toString('hex').toUpperCase();
};

const getMembros = (participants) => {
    return participants.map(p => p.id);
};

const getGroupAdmins = (participants) => {
    return participants.filter(p => p.admin !== null).map(p => p.id);
};

const getRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const banner = (text) => `\n═══════════════════\n${text}\n═══════════════════\n`;

const banner2 = (text) => `\n┌─────────────────────\n│ ${text}\n└─────────────────────\n`;

const banner3 = (text) => `\n╔═══════════════════╗\n║ ${text}\n╚═══════════════════╝\n`;

const temporizador = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const chyt = (text) => {
    console.log(`[CHYT] ${text}`);
};

const getBuffer = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        throw new Error(`Failed to get buffer: ${error.message}`);
    }
};

const fetchJson = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch JSON: ${error.message}`);
    }
};

const fetchText = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch text: ${error.message}`);
    }
};

const createExif = (packname, author) => {
    const stickerMetadata = {
        "sticker-pack-id": "com.whatsapp.android.stickerpack",
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
        "sticker-pack-version": "1.0.0"
    };
    return Buffer.from(JSON.stringify(stickerMetadata));
};

const getBase64 = (buffer) => {
    return buffer.toString('base64');
};

const convertSticker = async (media) => {
    // Placeholder for sticker conversion
    return media;
};

const upload = async (buffer) => {
    // Placeholder for file upload
    return 'https://telegra.ph/file/placeholder.jpg';
};

const nit = (text) => {
    return text.replace(/\n/g, ' ').trim();
};

const getpc = (percent) => {
    return Math.round(percent * 100) / 100;
};

const supre = (text, max = 100) => {
    return text.length > max ? text.substring(0, max) + '...' : text;
};

const recognize = async (buffer) => {
    // Placeholder for audio recognition
    return 'Audio recognition not implemented';
};

module.exports = {
    wait,
    getExtension,
    generateMessageID,
    getMembros,
    getGroupAdmins,
    getRandom,
    banner,
    banner2,
    banner3,
    temporizador,
    chyt,
    getBuffer,
    fetchJson,
    fetchText,
    createExif,
    getBase64,
    convertSticker,
    upload,
    nit,
    getpc,
    supre,
    recognize
};