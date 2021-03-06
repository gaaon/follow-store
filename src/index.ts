import { loadSmartStorePage } from './load'
import dotenv from 'dotenv'
import moment from 'moment'

import { extractPreloadedStateFromPage, extractOptionCombinationsFromPreloadedState } from './extract'
import { initBot, sendMessage } from './message'

dotenv.config()

let count = 0

async function check(smartStorePageUrl: string, smartStorePageTitle: string, targetOptionName: string) {
  const page = await loadSmartStorePage(smartStorePageUrl)
  const preloadedState: any = extractPreloadedStateFromPage(page)
  const optionCombinations = extractOptionCombinationsFromPreloadedState(preloadedState)

  const targetOptionComb = optionCombinations.find(optionComb => optionComb.optionName2 === targetOptionName)
  if (!targetOptionComb) {
    throw new Error('target option comb cannot be empty')
  }

  let message: string|undefined
  if (targetOptionComb.stockQuantity > 0) {
    message = `${smartStorePageTitle}\nstock found!!!! for ${targetOptionName}`
  } else {
    console.log(`no stock for ${targetOptionName}`)
    // message = `no stock for ${targetOptionName}`
  }

  if (message) {
    await sendMessage(message)
  } else {
    if (count % 100 === 0) {
      await sendMessage(`${smartStorePageTitle}\ncheck counts ${count}`)
    }
  }

  count++
}

async function main() {
  const smartStorePageUrl = process.env['SMART_STORE_PAGE']
  if (!smartStorePageUrl) {
    throw new Error('smart store page should be set')
  }

  const smartStorePageTitle = process.env['SMART_STORE_TITLE']
  if (!smartStorePageTitle) {
    throw new Error('smart store title should be set')
  }

  const targetOptionName = process.env['TARGET_OPTION_NAME']
  if (!targetOptionName) {
    throw new Error('target option name should be set')
  }
  
  const telegramToken = process.env['TELEGRAM_TOKEN']
  if (!telegramToken) {
    throw new Error('telegram token should be set')
  }

  const telegramChatId: string|undefined = process.env["TELEGRAM_CHAT_ID"]
  if (!telegramChatId) {
    throw new Error('telegram chat room id shoudl be set')
  }
  
  initBot(telegramToken, parseInt(telegramChatId))

  await sendMessage('start follow bot')

  while(true) {
    try {
      await check(smartStorePageUrl, smartStorePageTitle, targetOptionName)
    } catch (e) {
      await sendMessage(e.message)
      process.exit(1)
    }

    const duration = (Math.floor(Math.random() * 50) + 20) * 1000
    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })
  }
}

main()