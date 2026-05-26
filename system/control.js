const OWNER_WELCOME_MSGS = [
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *دخل المطور 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ⚡*\n┃\n┃ يا كبير... النظام تحت أمرك 👁‍🗨\n┃ الجروب بقى في أمان 🕷️\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`,
    `*🔥 المطور نزل على الجروب*\n\nاستعدوا... 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 هنا 👑⚡\n\n> _النظام بيعرف مين يستاهل_`,
    `*⚡ تحذير - دخول المطور*\n\n𝑬𝑺𝑪𝑨𝑵𝑶𝑹 دخل الجروب 🕷️\n\n> _من يجرؤ على استفزازه؟ ☠️_`,
];

const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;

        const users = participants.length
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ')
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        // الترحيب - سواء دخل من رابط (author = نفسه) أو حد ضافه
        const messages = {
            add: `♡゙ مـنـور/ه ${users}${author && author !== participants[0] ? `\n𝐛𝐲 ${authorTag}` : ''}`,
            remove: `${users} تم إزالته من الجروب${author && author !== participants[0] ? `\n𝐛𝐲 ${authorTag}` : ''}`,
            promote: `♡゙ مـبـروك الادمـن ${users}\nby ${authorTag}`,
            demote: `♡゙ بـقـيـت عـضـو خـلاص ${users}\nby ${authorTag}`
        };

        const txt = messages[eventType];
        if (!txt) return null;

        if (global.db?.groups?.[event.chat]?.noWelcome === true) return 9999;

        // ====== ترحيب خاص بالمطور ======
        if (eventType === 'add') {
            const owners = ctx.config?.owners || [];
            const isOwnerJoining = participants.some(p =>
                owners.some(o => p === o.jid || p === o.lid)
            );

            if (isOwnerJoining) {
                const ownerMsg = OWNER_WELCOME_MSGS[Math.floor(Math.random() * OWNER_WELCOME_MSGS.length)];
                await ctx.sock.sendMessage(event.chat, {
                    text: ownerMsg,
                    mentions: participants
                });
                return null;
            }
        }

        const img = ["remove", "add"].includes(eventType)
            ? (event.userUrl || "https://i.postimg.cc/RFqPQkhZ/8653766a329a5a5a714e221e9aa67e3a.jpg")
            : "https://i.postimg.cc/xd6xmf0p/9e0c32d018f9bea5a756fffa76e95b3a.jpg";

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info.nameBot || "WhatsApp Bot",
            body: "𝐴 𝑠𝑖𝑚𝑝𝑙𝑒 𝑊𝒉𝑎𝑡𝑠𝐴𝑝𝑝 𝑏𝑜𝑡 𝑓𝑜𝑟 𝑏𝑒𝑔𝑖𝑛𝑛𝑒𝑟𝑠, 𝑏𝑦 𝐸𝑆𝐶𝐴𝑁𝑂𝑅",
            mentions: author ? [author, ...participants] : participants,
            newsletter: {
                name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
                jid: '120363422581600030@newsletter'
            },
            big: ["remove", "add"].includes(eventType)
        });

    } catch (e) {
        console.error(e);
    }
    return null;
};

const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*♡⏳ استنى ${time ? Math.ceil(time / 1000) : 'بعض كام'} ثانية وكمل الأمر ⏳♡*\n⊱⋅ ──────────── ⋅⊰\n> *_لازم تصبر شويه عشان الأمر ده مينفعش فيه الاسبام_*`,
        owner: `*♡ 🇦🇱 الأمر ده لـ المطورين فقط 🇦🇱♡*\n⊱⋅ ──────────── ⋅⊰\n> *_الامر ده لـ المطورين البوت لازم تكون مطور عشان تقدر تستخدمه_`,
        group: `*♡💠 الأمر ده بيشتغل بس ف الجروبات 💠♡*\n⊱⋅ ──────────── ⋅⊰\n> *_لازم الأمر ده تستخدمه ف جروب فقط ممنوع غير كده_*`,
        admin: `*♡📯 الأمر ده لـ الادمن فقط 📯♡*\n⊱⋅ ──────────── ⋅⊰\n> *_انت مجرد عضو لازم تبقي ادمن يا عضو يا عبد_*`,
        private: `*♡🏷️ الأمر ده في الخاص فقط 🏷️♡*\n⊱⋅ ──────────── ⋅⊰\n> *_الامر ف الخاص بس ياحبيبي_*`,
        botAdmin: `*♡📌 لازم اكون ادمن عشان انقذ الأمر 📌♡*\n⊱⋅ ──────────── ⋅⊰\n> *_حطني ادمن عشان تقدر تستعمل الأمر ده_*`,
        noSub: `*♡⚜️ الأمر ده ف البوت الأساسي فقط ⚜️♡*\n⊱⋅ ──────────── ⋅⊰\n> *_ادخل الجروب ده و جرب الأمر [ https://chat.whatsapp.com/DMnRh2RkQXT8muRNgxiPoi?s=cl&p=a&mlu=3 ] ياريت من غير سبام_*`,
        disabled: `*♡🗃️ الامر متوقف (تحت صيانة) 🗃️♡*\n⊱⋅ ──────────── ⋅⊰\n> *_الامر تحت صيانه قريباً بيشتغل تاني_*`,
        error: `*♡❌ الأمر فيه خطأ، كلم المطورين ❌♡*\n⊱⋅ ──────────── ⋅⊰\n*_اكتب " .المطور " عشان يبعتلك رقم المطور_*`
    };

    if (conn && messages[checkType]) {
        await conn.msgUrl(msg.chat, messages[checkType], {
            img: "https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg",
            title: "𝐀𝐥𝐞𝐫𝐭𝐬 | 𝐖𝐚𝐫𝐧𝐢𝐧𝐠𝐬",
            body: "𝐵𝑜𝑡 𝑎𝑙𝑒𝑟𝑡𝑠: 𝑅𝑒𝑎𝑑 𝑡𝒉𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑙𝑒𝑎𝑟𝑛 𝑚𝑜𝑟𝑒",
            newsletter: {
                name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐿 🕷️',
                jid: '120363422581600030@newsletter'
            },
            big: false
        }, quoted);
        return false;
    }
    return null;
};

export { access, group };
