const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN, SHOP_NAME } = require('./config');
const { iphones } = require('./data/iphones');
const keyboards = require('./keyboards');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log(`🤖 ${SHOP_NAME} bot ishga tushdi!`);

// ===== START BUYRUG'I =====
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "do'stim";

    const welcomeText = `
🌟 **Assalomu alaykum, ${name}!** 🌟

🏪 **${SHOP_NAME}**'ga xush kelibsiz!

📱 Bizda **barcha turdagi iPhone** modellari mavjud:
• iPhone 15 Pro Max 🔥
• iPhone 15 Pro ⚡
• iPhone 15 Plus 💙
• iPhone 15 🌸
• Va boshqalar...

💰 **Eng yaxshi narxlar!**
🚚 **Tez yetkazib berish!**
✅ **Rasmiy kafolat!**

👇 **Kerakli bo'limni tanlang:**
    `;

    bot.sendMessage(chatId, welcomeText, {
        parse_mode: 'Markdown',
        ...keyboards.mainMenu
    });
});

// ===== XABARLARNI QABUL QILISH =====
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "📱 iPhone Modellari") {
        showAllIphones(chatId);
    } 
    else if (text === "🔥 Yangi Kelganlar") {
        showNewIphones(chatId);
    }
    else if (text === "💎 Eng Arzonlar") {
        showCheapIphones(chatId);
    }
    else if (text === "📞 Biz bilan bog'lanish") {
        showContacts(chatId);
    }
    else if (text === "ℹ️ Bot haqida") {
        showAbout(chatId);
    }
});

// ===== BARCHA IPHONE'LARNI KO'RSATISH =====
function showAllIphones(chatId) {
    bot.sendMessage(chatId, `📱 **Barcha iPhone modellari** (${iphones.length} ta):`);

    iphones.forEach((phone, index) => {
        setTimeout(() => {
            const caption = `
${phone.emoji} **${phone.name}** (${phone.year})

📸 **Kamera:** ${phone.camera}
💾 **Xotira:** ${phone.storage}
🔋 **Batareya:** ${phone.battery}
⚙️ **Chip:** ${phone.chip}

💰 **Narxi:** ${phone.price.toLocaleString()} so'm

✨ ${phone.description}
            `;

            bot.sendPhoto(chatId, phone.image, {
                caption: caption,
                parse_mode: 'Markdown',
                ...keyboards.iphoneKeyboard(phone.id)
            });
        }, index * 500); // Har biridan keyin 0.5 sekund kutish
    });
}

// ===== YANGI IPHONE'LAR =====
function showNewIphones(chatId) {
    const newIphones = iphones.filter(p => p.year >= 2023);

    bot.sendMessage(chatId, `🔥 **Yangi kelgan iPhone'lar:**`);

    newIphones.forEach((phone, index) => {
        setTimeout(() => {
            const caption = `
${phone.emoji} **${phone.name}**

💰 **Narxi:** ${phone.price.toLocaleString()} so'm

✨ ${phone.description}
            `;

            bot.sendPhoto(chatId, phone.image, {
                caption: caption,
                parse_mode: 'Markdown',
                ...keyboards.iphoneKeyboard(phone.id)
            });
        }, index * 500);
    });
}

// ===== ENG ARZON IPHONE'LAR =====
function showCheapIphones(chatId) {
    const cheapIphones = [...iphones].sort((a, b) => a.price - b.price).slice(0, 5);

    bot.sendMessage(chatId, `💎 **Eng arzon iPhone'lar:**`);

    cheapIphones.forEach((phone, index) => {
        setTimeout(() => {
            const caption = `
${phone.emoji} **${phone.name}** (${phone.year})

💰 **Narxi:** ${phone.price.toLocaleString()} so'm

✨ ${phone.description}
            `;

            bot.sendPhoto(chatId, phone.image, {
                caption: caption,
                parse_mode: 'Markdown',
                ...keyboards.iphoneKeyboard(phone.id)
            });
        }, index * 500);
    });
}

// ===== KONTAKTLAR =====
function showContacts(chatId) {
    const text = `
📞 **Biz bilan bog'lanish**

👤 **Menejer:** Jamoliddin
📱 **Telefon:** +998 90 123 45 67
✉️ **Email:** info@iphoneshop.uz
📍 **Manzil:** Toshkent, Amir Temur ko'chasi 15

🕒 **Ish vaqti:** Har kuni 09:00 - 21:00

💬 **Savollaringiz bo'lsa, yozing!**
    `;

    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}

// ===== BOT HAQIDA =====
function showAbout(chatId) {
    const text = `
ℹ️ **${SHOP_NAME} haqida**

🏪 Biz 2015-yildan buyon iPhone'larni sotamiz.

✅ **Afzalliklarimiz:**
• Rasmiy kafolat
• Tez yetkazib berish
• Arzon narxlar
• Sifatli xizmat

📱 **${iphones.length} ta** iPhone modeli mavjud!

💚 **Bizni tanlaganingiz uchun rahmat!**
    `;

    bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
}

// ===== CALLBACK (INLINE TUGMALAR) =====
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith('buy_')) {
        const id = parseInt(data.split('_')[1]);
        const phone = iphones.find(p => p.id === id);

        const text = `
🛒 **Buyurtma berish**

📱 **Model:** ${phone.name}
💰 **Narxi:** ${phone.price.toLocaleString()} so'm

📞 **Buyurtma uchun qo'ng'iroq qiling:**
+998 90 123 45 67

Yoki menejerga yozing: @manager_username
        `;

        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }
    else if (data.startsWith('details_')) {
        const id = parseInt(data.split('_')[1]);
        const phone = iphones.find(p => p.id === id);

        const text = `
📱 **${phone.name}**

📅 **Yil:** ${phone.year}
🎨 **Rang:** ${phone.color}
💾 **Xotira:** ${phone.storage}
📺 **Ekran:** ${phone.display}
📸 **Kamera:** ${phone.camera}
🔋 **Batareya:** ${phone.battery}
⚙️ **Chip:** ${phone.chip}

💰 **Narxi:** ${phone.price.toLocaleString()} so'm

✨ ${phone.description}
        `;

        bot.sendMessage(chatId, text, {
            parse_mode: 'Markdown',
            ...keyboards.iphoneKeyboard(phone.id)
        });
    }
    else if (data === 'back') {
        bot.sendMessage(chatId, "Asosiy menyu:", keyboards.mainMenu);
    }

    bot.answerCallbackQuery(query.id);
});

// ===== XATOLIKLARNI USHLASH =====
bot.on('polling_error', (error) => {
    console.log('Xatolik:', error.message);
});

console.log('✅ Bot tayyor! Telegram\'da /start yozing.');