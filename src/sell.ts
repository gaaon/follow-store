import dotenv from 'dotenv'
import path from 'path'

import { sendMessage, initBot } from "./message"
import { loadSmartStorePage } from "./load"


dotenv.config({
  path: path.resolve(process.cwd(), 'sell.env')
})

// 이 상품은 현재 구매하실 수 없는 상품입니다.
async function check(pageUrl: string, pageTitle: string) {
  const pageContent = await loadSmartStorePage(pageUrl)

  if (!pageContent.includes('이 상품은 현재 구매하실 수 없는 상품입니다')) {
    await sendMessage(`${pageTitle}\n구매 가능!!!`)
  } else {
    console.log('아직 구매 불가')
  }
}

async function main() {
  const pageUrl = process.env['SMART_STORE_PAGE']
  if (!pageUrl) {
    throw new Error('smart store page should be set')
  }

  const pageTitle = process.env['SMART_STORE_TITLE']
  if (!pageTitle) {
    throw new Error('smart store title should be set')
  }

  const telegramToken = process.env['TELEGRAM_TOKEN']
  if (!telegramToken) {
    throw new Error('telegram token should be set')
  }

  const telegramChatId = process.env["TELEGRAM_CHAT_ID"]
  if (!telegramChatId) {
    throw new Error('telegram chat room id shoudl be set')
  }

  initBot(telegramToken, parseInt(telegramChatId))

  await sendMessage('start sell follow bot')

  while(true) {
    try {
      await check(pageUrl, pageTitle)
    } catch (e) {
      await sendMessage(e.message)
      process.exit(1)
    }

    const duration = (Math.floor(Math.random() * 20) + 10) * 1000
    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
}

main()