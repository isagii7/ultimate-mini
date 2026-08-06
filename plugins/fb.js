const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "fb",
  react: "📥",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  use: ".fb <video link>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(`*KOI FACEBOOK VIDEO LINK TO DO 😅*\n*EXAMPLE:*\n*📌 .fb https://www.facebook.com/...*\n\n*PHIR MAI DOWNLOAD KAR KE DUNGA 😃*`);

    const apiUrl = `https://movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (data.status !== true) {
      return reply("*❌ API ERROR*: Try again later.");
    }

    if (!Array.isArray(data.results) || data.results.length === 0) {
      return reply("*😔 KOI VIDEO NAHI MILI*");
    }

    const result = data.results[0];
    const videoUrl = result.hdQualityLink || result.normalQualityLink;

    if (!videoUrl) {
      return reply("*❌ VALID FACEBOOK VIDEO LINK DAALO*");
    }

    const caption = `╭━━━《 *📥 NEXTY MINI 👀 - FB DL* 》━━━┈⊷
┃
┃ ✦ *QUALITY* : ${result.hdQualityLink ? 'HD' : 'SD'}
┃ ✦ *CREATOR* : ${data.creator || 'Unknown'}
┃ ✦ *DURATION* : ${result.duration || 'N/A'}
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*`;

    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: caption
      },
      { quoted: mek }
    );

    await m.react("✅");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Kuch galat ho gaya. Dobara try karo.");
  }
});