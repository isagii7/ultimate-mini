const { cmd } = require("../arslan");
const fetch = require("node-fetch");
const yts = require("yt-search");
const axios = require("axios");
const { fakevCard } = require('../lib/fakevCard');

// ============================================================
// COMMAND 1: SONG / MP3 DOWNLOAD (.play, .song, .mp3)
// ============================================================
cmd({
    pattern: "song",
    alias: ["ytmp3", "play", "mp3", "gana", "music", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 download",
    category: "download",
    use: ".play <song name or link>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Please provide a song name or YouTube link.");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube Search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ No results found.");
        }

        const video = search.videos[0];

        // 🎧 MP3 API (waisa hi rakha)
        const apiUrl = `https://arslan-apis-v2.vercel.app/download/ytmp4?url=${video.url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (!res.data || !res.data.status || !res.data.result || !res.data.result.download || !res.data.result.download.url) {
            return reply("❌ Audio generation failed. Try again.");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;
        const quality = res.data.result.download.quality || "128kbps";

        // 🎵 Send Audio with Branding
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${meta.title || "song"}.mp3`,
            caption:
                `🎵 *${meta.title || "Unknown Title"}*\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> 🔥 *NEXTY MINI 👀*`,
            contextInfo: {
                externalAdReply: {
                    title: meta.title ? meta.title.substring(0, 40) : "YouTube Song",
                    body: "▶︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• ★彡 NEXTY MINI 👀 彡★",
                    thumbnailUrl: video.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fakevCard });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply("❌ Error occurred. Please try later.");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});

// ============================================================
// COMMAND 2: VIDEO DOWNLOAD (.video1, .vid, .ytv)
// ============================================================
cmd({
    pattern: 'video1',
    alias: ["vid", "ytv"],
    desc: "Download YouTube Video",
    category: 'downloader',
    react: '🪄',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("❌ Please provide a YouTube link or search query.\n\nExample: .video1 Pasoori");
        }

        let videoUrl;
        if (q.includes("youtube.com") || q.includes('youtu.be')) {
            videoUrl = q;
        } else {
            const search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0) {
                return reply("❌ No results found.");
            }
            videoUrl = search.videos[0].url;
        }

        // API (waisa hi rakha)
        const apiResponse = await fetch(`https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`);
        const data = await apiResponse.json();

        if (!data.status) {
            return reply("❌ Failed to fetch video.");
        }

        const { video_url_hd, video_url_sd } = data.result.media;
        const finalUrl = (video_url_hd !== "No HD video URL available") ? video_url_hd : video_url_sd;

        if (!finalUrl || finalUrl.includes('No')) {
            return reply("❌ No downloadable video found.");
        }

        await conn.sendMessage(from, {
            video: { url: finalUrl },
            caption: "*❀༒★[ NEXTY MINI 👀 ]★༒❀*"
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("VIDEO ERROR:", err);
        reply("❌ Error while fetching video.");
    }
});