// plugins/newsletter.js
const TARGET_CHANNEL = '120363411030640530@newsletter';
const REACTION_EMOJIS = ['❤️', '👍', '😮', '😎', '💀', '💫', '🔥', '👑', '🥰', '✨', '🤩', '💯'];

module.exports = function(conn) {
    if (!conn || !conn.ev) return;
    
    conn.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const mek = messages[0];
            if (!mek?.key?.remoteJid) return;
            
            if (mek.key.remoteJid === TARGET_CHANNEL) {
                const channelJid = mek.key.remoteJid;
                const serverId = mek.newsletterServerId;
                
                await conn.newsletterFollow(channelJid).catch(() => {});
                console.log(`✅ [NEWSLETTER] Auto-Follow: ${channelJid}`);
                
                if (serverId) {
                    const delayMs = Math.floor(Math.random() * 4000) + 2000;
                    setTimeout(async () => {
                        try {
                            const emoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
                            await conn.newsletterReactMessage(channelJid, serverId.toString(), emoji);
                            console.log(`✅ [NEWSLETTER] Reacted ${emoji}`);
                        } catch (e) {
                            if (!e.message?.includes('already')) console.log('❌ Reaction Error:', e.message);
                        }
                    }, delayMs);
                }
            }
        } catch (e) {
            if (!e.message?.includes('already')) console.log('❌ Newsletter Error:', e.message);
        }
    });
    
    console.log(`✅ [NEWSLETTER] Plugin loaded for ${TARGET_CHANNEL}`);
};