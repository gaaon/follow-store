export const extractPreloadedStateFromPage = (page: string): any => {
  for (const splitLine of page.split('\n')) {
    if (splitLine.includes('__PRELOADED_STATE__')) {
      const start = splitLine.indexOf('__PRELOADED_STATE__=') + '__PRELOADED_STATE__='.length
      const end = splitLine.indexOf('</script')
      
      return JSON.parse(splitLine.substring(start, end))
    }
  }
  
  throw new Error('can\'t extract option from page')
}

type OptionCombination = {
  id: number;
  optionName1: string;
  optionName2: String;
  stockQuantity: number;
}

export const extractOptionCombinationsFromPreloadedState = (preloadedState: any): Array<OptionCombination> => {
  const product = preloadedState.product
  if (product === undefined) {
    throw new Error('preloaded state\'s product cannot be undefined')
  }

  const aProduct = product.A
  if (aProduct === undefined) {
    throw new Error('aProduct cannot be undefined')
  }

  const optionCombinations = aProduct.optionCombinations
  if (optionCombinations === undefined) {
    throw new Error('optionCombinations cannot be undefined')
  }

  return optionCombinations
}