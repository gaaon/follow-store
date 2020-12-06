import { extractOptionCombinationsFromPreloadedState, extractPreloadedStateFromPage } from "./extract"
import { loadSmartStorePage } from "./load"

import dotenv from 'dotenv'
import { sendMessage, initBot } from "./message"

dotenv.config()

async function check(pageUrl: string, pageTitle: string) {
  const page = await loadSmartStorePage(pageUrl)
  const preloadedState = extractPreloadedStateFromPage(page)
  const optionCombs = extractOptionCombinationsFromPreloadedState(preloadedState)

  let message = `${pageTitle}\n\n`

  for (const optionComb of optionCombs) {
    message += `${optionComb.optionName1}: ${optionComb.stockQuantity}\n`
  }

  sendMessage(message)
}

async function main() {
  const pageUrl = process.env['STOCK_SMART_STORE_PAGE']
  if (!pageUrl) {
    throw new Error('stock smart store page should be set')
  }

  const pageTitle = process.env['STOCK_SMART_STORE_TITLE']
  if (!pageTitle) {
    throw new Error('stock smart store title should be set')
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

  while(true) {
    await check(pageUrl, pageTitle)

    const duration = 60 * 60 * 1000
    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
  
}

main()