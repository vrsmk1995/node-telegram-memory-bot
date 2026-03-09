
module.exports = function (bot, sendWithTyping) {
    const reasons = [
        "You have the most beautiful smile that brightens my day 😊",
        "Your kindness and compassion inspire me every day ❤️ ",
        "I love how you always know how to make me laugh 😂",
        "You make my life happier ❤️",
        "You support me in difficult times 💕",
        "Your smile makes my day better 😊",
        "You understand me better than anyone 🤍",
        "You are the best thing that ever happened to me 💖"
    ] 
    
    bot.onText(/\/reasons/, (msg) => {
        const chatId = msg.chat.id;
      
        const RandomReason = reasons[Math.floor(Math.random() * reasons.length)];
        sendWithTyping(bot, chatId, "Reason I love You :\n\n " +RandomReason, 2000);
    
    });
};