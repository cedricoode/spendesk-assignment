import CurrencyExtrangeRepository from '../repositories/CurrencyExchange';
import { Currencies } from '../entities/types';

class CurrencyService {
  currencyRepo: CurrencyExtrangeRepository;
  constructor() {
    this.currencyRepo = new CurrencyExtrangeRepository();
  }

  async convert(
    fromCurrency: Currencies,
    toCurrency: Currencies,
    amount: string
  ) {
    const currencyMap = await this.currencyRepo.getCurrenies();
    if (
      !(String(fromCurrency) in currencyMap) ||
      !(String(toCurrency) in currencyMap)
    ) {
      throw new Error('unable to convert the currency');
    }
    return (
      (Number(amount) / currencyMap[String(fromCurrency)]) *
      currencyMap[String(toCurrency)]
    );
  }
}

export default CurrencyService;
