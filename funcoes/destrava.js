// Destrava functionality
const fs = require('fs');

const destrava = {
    adicionar: (userId) => {
        const data = fs.existsSync('./database/func/destrava.json') ? 
                     JSON.parse(fs.readFileSync('./database/func/destrava.json', 'utf8')) : 
                     { destravados: [] };
        
        if (!data.destravados.includes(userId)) {
            data.destravados.push(userId);
            fs.writeFileSync('./database/func/destrava.json', JSON.stringify(data, null, 2));
        }
        return true;
    },
    
    remover: (userId) => {
        const data = fs.existsSync('./database/func/destrava.json') ? 
                     JSON.parse(fs.readFileSync('./database/func/destrava.json', 'utf8')) : 
                     { destravados: [] };
        
        data.destravados = data.destravados.filter(id => id !== userId);
        fs.writeFileSync('./database/func/destrava.json', JSON.stringify(data, null, 2));
        return true;
    },
    
    verificar: (userId) => {
        const data = fs.existsSync('./database/func/destrava.json') ? 
                     JSON.parse(fs.readFileSync('./database/func/destrava.json', 'utf8')) : 
                     { destravados: [] };
        
        return data.destravados.includes(userId);
    }
};

const destrava2 = {
    ...destrava,
    arquivo: './database/func/destrava2.json'
};

module.exports = { destrava, destrava2 };