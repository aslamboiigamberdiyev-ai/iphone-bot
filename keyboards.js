module.exports = {
    // Asosiy menyu
    mainMenu: {
        reply_markup: {
            keyboard: [
                [{ text: "📱 iPhone Modellari" }],
                [{ text: "🔥 Yangi Kelganlar" }, { text: "💎 Eng Arzonlar" }],
                [{ text: "📞 Biz bilan bog'lanish" }],
                [{ text: "ℹ️ Bot haqida" }]
            ],
            resize_keyboard: true
        }
    },

    // iPhone uchun tugmalar
    iphoneKeyboard: (id) => ({
        inline_keyboard: [
            [
                { text: "🛒 Sotib olish", callback_data: `buy_${id}` },
                { text: "📷 Batafsil", callback_data: `details_${id}` }
            ],
            [
                { text: "⬅️ Orqaga", callback_data: "back" }
            ]
        ]
    }),

    // Orqaga tugmasi
    backKeyboard: {
        inline_keyboard: [
            [{ text: "⬅️ Orqaga", callback_data: "back" }]
        ]
    }
};