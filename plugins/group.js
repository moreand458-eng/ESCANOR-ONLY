const BUSY_MSG = `*🛡⚜️ مطوري مش فاضي شويه وهيكلمك*`;

const ONLINE_MSGS = [
    `تم استشعار المطور 👁‍🗨\nالنظام تحت أمرك يا سيد 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 👑⚡`,
    `𝐄𝐒𝐂𝐀𝐍𝛩𝐑 هنا 🕷️\nأوامرك يا معلم 👑`,
    `النظام بيعرف مين يستاهل 👁‍🗨\nأهلاً بيك يا 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 ⚡`
];

const handler = async (m, { conn, bot }) => {
    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    if (isOwner) {
        const msg = ONLINE_MSGS[Math.floor(Math.random() * ONLINE_MSGS.length)];
        return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
    }

    // مش المطور كتبها - نشوف الحالة
    try {
        // جيب حالة كل المطورين
        for (const owner of bot.config.owners) {
            if (!owner.jid) continue;
            try {
                const presence = await conn.fetchStatus(owner.jid);
                const isBusy = presence?.status?.toLowerCase().includes('busy') ||
                               presence?.status?.toLowerCase().includes('مشغول') ||
                               presence?.status?.toLowerCase().includes('مش فاضي');

                if (isBusy) {
                    return conn.sendMessage(m.chat, { text: BUSY_MSG }, { quoted: m });
                }
            } catch {}
        }
    } catch {}

    return conn.sendMessage(m.chat, {
        text: `أنا 𝐄𝐒𝐂𝐀𝐍𝛩𝐑… نادِني باسمي يا هذا ☠️`
    }, { quoted: m });
};

handler.command = ["بوت"];
handler.usePrefix = false;
handler.disabled = false;

export default handler;
