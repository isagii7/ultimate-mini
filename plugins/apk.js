const { cmd } = require('../arslan');
const axios = require('axios');

cmd({
  pattern: "apk",
  alias: ["app", "playstore", "application"],
  react: "📱",
  desc: "Download APK via Aptoide",
  category: "download",
  use: ".apk <app name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("*KOI APK KA NAAM TO LIKHO 😅*\n*EXAMPLE:*\n*📌 .apk whatsapp*\n*📌 .apk instagram*\n\n*PHIR MAI APKO DOWNLOAD KAR KE DUNGA 😃*");

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("*😔 KOI APK NAHI MILI*");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2);

    let caption = `╭━━━《 *📱 NEXTY MINI 👀 - APK* 》━━━┈⊷
┃
┃ ✦ *NAME* : ${app.name.toUpperCase()}
┃ ✦ *SIZE* : ${appSize} MB
┃ ✦ *PACKAGE* : ${app.package}
┃ ✦ *VERSION* : ${app.file.vername}
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*`;

    // Send app icon with info
    await conn.sendMessage(from, { 
      image: { url: app.icon }, 
      caption 
    }, { quoted: mek });

    // Send APK file
    await conn.sendMessage(from, {
      document: { url: app.file.path || app.file.path_alt },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${app.name}.apk`
    }, { quoted: mek });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Kuch galat ho gaya. Dobara try karo.");
  }
});