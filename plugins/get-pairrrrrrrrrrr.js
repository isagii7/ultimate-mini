const { cmd, commands } = require('../arslan');
const axios = require('axios');

// ✅ UPDATED IMAGE - tumhari wali
const PAIR_IMG = "https://files.catbox.moe/93fe56.jpg";

cmd({
    pattern: "pair",
    alias: ["getpair", "pairing", "clonebot"],
    react: "✅",
    desc: "Get pairing code for NEXTY MINI 👀 bot",
    category: "download",
    use: ".pair 92323***",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extract phone number from command
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 92323***`");
        }

        // ✅ API CALL - Waisi ki waisi (Arslan ki API)
        const response = await axios.get(`https://arslan-mini-bot-e4ec84c138eb.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *PAIRING COMPLETED*";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code again
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});

cmd({
    pattern: "pair2",
    alias: ["getpair2", "reqpair", "clonebot2"],
    react: "📉",
    desc: "Get pairing code for NEXTY MINI 👀 bot",
    category: "download",
    use: ".pair 92323XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Check if in group
        if (isGroup) {
            return await reply("❌ This command only works in private chat. Please message me directly.");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Extract phone number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Invalid phone number format!\n\nPlease use: `.pair 92323000000000`\n(Without + sign)");
        }

        // ✅ API CALL - Waisi ki waisi (Arslan ki API)
        const response = await axios.get(`https://arslan-mini-bot-e4ec84c138eb.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data?.code) {
            return await reply("❌ Failed to get pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        
        // ✅ UPDATED IMAGE + BRANDING
        await conn.sendMessage(from, {
            image: { url: PAIR_IMG }, // ✅ Tumhari nayi image
            caption: `╭━━━《 *🔐 NEXTY MINI 👀 - PAIR* 》━━━┈⊷
┃
┃ ✦ *STATUS* : Pairing Code Generated
┃ ✦ *CODE* : ${pairingCode}
┃
┃ 📌 Notification sent to your WhatsApp.
┃ ✦ Check your phone & enter this code.
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*
> *Copy the code from below message 👇🏻*`
        }, { quoted: m });

        // Send clean code separately
        await reply(pairingCode);
        
        // Add ✅ reaction to the clean code message
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred. Please try again later.");
    }
});