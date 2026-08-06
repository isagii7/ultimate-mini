const { cmd, commands } = require('../arslan');
const config = require('../config');
const os = require('os');

// =================================================================
// 🚀 UPTIME & SPEED TEST
// =================================================================
cmd({
    pattern: "uptime",
    alias: ["speed", "ping"],
    desc: "Check bot latency and system resources",
    category: "general",
    react: "⚡",
    filename: __filename
},
async(conn, mek, m, { from, reply, myquoted }) => {
    try {
        const start = Date.now();
        
        // 1. Sending test message
        const msg = await conn.sendMessage(from, { text: '*⏳ T E S T I N G . . .*' }, { quoted: myquoted });
        
        const end = Date.now();
        const latency = end - start;
        
        // 2. Memory calculation (RAM)
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        // 3. Final styled message
        const pingMsg = `
╭━━━《 *⚡ NEXTY MINI 👀 - UPTIME* 》━━━┈⊷
┃
┃ ✦ *LATENCY* : ${latency} ms
┃ ✦ *RAM USAGE* : ${usedMem} MB / ${totalMem} MB
┃ ✦ *PLATFORM* : ${os.platform()} ${os.release()}
┃ ✦ *UPTIME* : ${Math.floor(process.uptime())} seconds
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*
`;

        // 4. Edit the message (update)
        await conn.sendMessage(from, { text: pingMsg, edit: msg.key });

    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});


// =================================================================
// 👑 OWNER CONTACT CARD
// =================================================================
cmd({
    pattern: "owner",
    desc: "Contact the bot owner",
    category: "general",
    react: "👑",
    filename: __filename
},
async(conn, mek, m, { from, myquoted }) => {
    const ownerNumber = config.OWNER_NUMBER[0] || '923343394384'; // your owner number
    
    // Create vCard
    const vcard = 'BEGIN:VCARD\n' +
                  'VERSION:3.0\n' +
                  'FN:NEXTY MINI 👀 (Owner)\n' +
                  'ORG:NEXTY MINI Corp;\n' +
                  `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
                  'END:VCARD';

    await conn.sendMessage(from, {
        contacts: {
            displayName: 'NEXTY MINI 👀',
            contacts: [{ vcard }]
        }
    }, { quoted: myquoted });
});