const { cmd } = require('../arslan');

// ============================================================
// 1. TAG ALL
// ============================================================
cmd({
  pattern: "tagall",
  alias: ["everyone", "mentionall"],
  desc: "Mention all group members",
  category: "group",
  react: "📢",
  use: ".tagall (optional message)",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply, groupName, participants }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    let text = q || "📢 *NEXTY MINI 👀 - ATTENTION PLEASE*";
    let mentions = [];

    for (let participant of participants) {
      mentions.push(participant.id);
    }

    let message = `${text}\n\n`;
    message += `╭━━━《 *TAG ALL* 》━━━┈⊷\n`;
    message += `┃ ✦ *GROUP* : ${groupName}\n`;
    message += `┃ ✦ *MEMBERS* : ${participants.length}\n`;
    message += `╰━━━━━━━━━━━━┈⊷\n\n`;
    
    // Add all participants with mentions
    let mentionString = '';
    for (let i = 0; i < mentions.length; i++) {
      mentionString += `┃ ✦ @${mentions[i].split('@')[0]}\n`;
    }
    message += mentionString;

    await conn.sendMessage(from, {
      text: message,
      mentions: mentions
    }, { quoted: mek });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Kuch galat ho gaya.");
  }
});

// ============================================================
// 2. GROUP INFO
// ============================================================
cmd({
  pattern: "gcinfo",
  alias: ["groupinfo", "ginfo"],
  desc: "Get group information",
  category: "group",
  react: "ℹ️",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, groupName, groupMetadata, participants, groupAdmins }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");

    const totalMembers = participants ? participants.length : 0;
    const totalAdmins = groupAdmins ? groupAdmins.length : 0;
    
    // Group owner (creator)
    let groupOwner = "Unknown";
    if (groupMetadata && groupMetadata.owner) {
      groupOwner = groupMetadata.owner.split('@')[0];
    }

    // Created date
    let createdDate = "N/A";
    if (groupMetadata && groupMetadata.creation) {
      const date = new Date(groupMetadata.creation * 1000);
      createdDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const caption = `╭━━━《 *ℹ️ GROUP INFO* 》━━━┈⊷
┃
┃ ✦ *NAME* : ${groupName || 'N/A'}
┃ ✦ *OWNER* : @${groupOwner}
┃ ✦ *MEMBERS* : ${totalMembers}
┃ ✦ *ADMINS* : ${totalAdmins}
┃ ✦ *CREATED* : ${createdDate}
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*`;

    await conn.sendMessage(from, {
      text: caption,
      mentions: [groupMetadata ? groupMetadata.owner : null].filter(Boolean)
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Group info nahi mili.");
  }
});

// ============================================================
// 3. PROMOTE (Make Admin)
// ============================================================
cmd({
  pattern: "promote",
  desc: "Promote a member to admin",
  category: "group",
  react: "👑",
  use: ".promote (reply to user or tag)",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    // Get mentioned user or replied user
    let user = m.mentionedJid?.[0] || m.quoted?.sender || mek.key.participant || mek.key.remoteJid;

    if (!user || user === conn.user.id) {
      return reply("*❌ KISI MEMBER KO TAG KARO YA REPLY KARO*");
    }

    await conn.groupParticipantsUpdate(from, [user], "promote");
    reply(`✅ @${user.split('@')[0]} *ADMIN BAN GAYA* 👑`, { mentions: [user] });

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Promote nahi kar pa raha.");
  }
});

// ============================================================
// 4. DEMOTE (Remove Admin)
// ============================================================
cmd({
  pattern: "demote",
  desc: "Demote an admin to member",
  category: "group",
  react: "⬇️",
  use: ".demote (reply to user or tag)",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    let user = m.mentionedJid?.[0] || m.quoted?.sender || mek.key.participant || mek.key.remoteJid;

    if (!user || user === conn.user.id) {
      return reply("*❌ KISI MEMBER KO TAG KARO YA REPLY KARO*");
    }

    await conn.groupParticipantsUpdate(from, [user], "demote");
    reply(`⬇️ @${user.split('@')[0]} *ADMIN HATA DIYA*`, { mentions: [user] });

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Demote nahi kar pa raha.");
  }
});

// ============================================================
// 5. KICK / REMOVE
// ============================================================
cmd({
  pattern: "kick",
  alias: ["remove"],
  desc: "Remove a member from group",
  category: "group",
  react: "👢",
  use: ".kick (reply to user or tag)",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    let user = m.mentionedJid?.[0] || m.quoted?.sender || mek.key.participant || mek.key.remoteJid;

    if (!user || user === conn.user.id) {
      return reply("*❌ KISI MEMBER KO TAG KARO YA REPLY KARO*");
    }

    await conn.groupParticipantsUpdate(from, [user], "remove");
    reply(`👢 @${user.split('@')[0]} *GROUP SE HATA DIYA*`, { mentions: [user] });

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Kick nahi kar pa raha.");
  }
});

// ============================================================
// 6. GROUP LINK
// ============================================================
cmd({
  pattern: "link",
  desc: "Get group invite link",
  category: "group",
  react: "🔗",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    const link = await conn.groupInviteCode(from);
    const fullLink = `https://chat.whatsapp.com/${link}`;

    const caption = `╭━━━《 *🔗 GROUP LINK* 》━━━┈⊷
┃
┃ ✦ *LINK* : ${fullLink}
┃
╰━━━━━━━━━━━━━━━┈⊷

> 🔥 *Powered by NEXTY MINI 👀*`;

    await conn.sendMessage(from, { text: caption }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Link generate nahi ho pa raha.");
  }
});

// ============================================================
// 7. REVOKE (Reset Link)
// ============================================================
cmd({
  pattern: "revoke",
  desc: "Reset group invite link",
  category: "group",
  react: "🔄",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    await conn.groupRevokeInvite(from);
    reply("*✅ LINK RESET HO GAYA*");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Revoke nahi ho pa raha.");
  }
});

// ============================================================
// 8. MUTE / UNMUTE GROUP
// ============================================================
cmd({
  pattern: "mute",
  desc: "Mute group for everyone (only admins can send messages)",
  category: "group",
  react: "🔇",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    await conn.groupSettingUpdate(from, 'announcement');
    reply("*🔇 GROUP MUTE KAR DIYA* (Sirf admin bhej sakte hain)");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Mute nahi kar pa raha.");
  }
});

cmd({
  pattern: "unmute",
  desc: "Unmute group (everyone can send messages)",
  category: "group",
  react: "🔊",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("*❌ YEH COMMAND SIRF GROUP MEIN CHALTI HAI*");
    if (!isAdmins) return reply("*❌ SIRF GROUP ADMIN USE KAR SAKTE HAIN*");
    if (!isBotAdmins) return reply("*❌ MUJHE ADMIN BANAO PHIR*");

    await conn.groupSettingUpdate(from, 'not_announcement');
    reply("*🔊 GROUP UNMUTE KAR DIYA* (Sab bhej sakte hain)");

  } catch (err) {
    console.error(err);
    reply("*❌ ERROR*: Unmute nahi kar pa raha.");
  }
});