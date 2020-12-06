import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot|undefined = undefined
let savedChatId: number|undefined = undefined

export const initBot = async (telegramToken: string, chatId: number|undefined) => {
  bot = new TelegramBot(telegramToken, {polling: true})

  if (chatId != undefined) {
    savedChatId = chatId
  }

  bot.on('message', (msg) => {
    let chatId = msg.chat.id
    console.log(chatId)
  })
}

export const sendMessage = async (message: string): Promise<void> => {
  if (!bot) {
    throw new Error('bot should be set')
  }

  if (!savedChatId) {
    throw new Error('chatId should be set')
  }

  await bot.sendMessage(savedChatId, message)
}