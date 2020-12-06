import { loadSmartStorePage } from './load'
import dotenv from 'dotenv'
import moment from 'moment'

import { extractPreloadedStateFromPage, extractOptionCombinationsFromPreloadedState } from './extract'
import { initBot, sendMessage } from './message'

dotenv.config()

async function check(smartStorePageUrl: string, targetOptionName: string) {
  const page = await loadSmartStorePage(smartStorePageUrl)
  const preloadedState: any = extractPreloadedStateFromPage(page)
  const optionCombinations = extractOptionCombinationsFromPreloadedState(preloadedState)

  const targetOptionComb = optionCombinations.find(optionComb => optionComb.optionName2 === targetOptionName)
  if (!targetOptionComb) {
    throw new Error('target option comb cannot be empty')
  }

  let message: string|undefined
  if (targetOptionComb.stockQuantity > 0) {
    message = `stock found!!!! for ${targetOptionName}`
  } else {
    // message = `no stock for ${targetOptionName}`
  }

  if (message) {
    await sendMessage(message)
  }
}

async function main() {
  const smartStorePageUrl: string|undefined = process.env['SMART_STORE_PAGE']
  if (!smartStorePageUrl) {
    throw new Error('smart store page should be set')
  }

  const targetOptionName: string|undefined = process.env['TARGET_OPTION_NAME']
  if (!targetOptionName) {
    throw new Error('target option name should be set')
  }
  
  const telegramToken: string|undefined = process.env['TELEGRAM_TOKEN']
  if (!telegramToken) {
    throw new Error('telegram token should be set')
  }

  const telegramChatId: string|undefined = process.env["TELEGRAM_CHAT_ID"]
  if (!telegramChatId) {
    throw new Error('telegram chat room id shoudl be set')
  }
  
  initBot(telegramToken, parseInt(telegramChatId))

  while(true) {
    try {
      await check(smartStorePageUrl, targetOptionName)
    } catch (e) {
      sendMessage(e.message)
      process.exit(1)
    }

    const duration = (Math.floor(Math.random() * 50) + 20) * 1000
    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
}

main()