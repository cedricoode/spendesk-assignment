import CurrencyExtrangeRepository from '../repositories/CurrencyExchange';
import { Currencies, Money } from '../entities/types';

class CurrencyService {
  currencyRepo: CurrencyExtrangeRepository;
  constructor() {
    this.currencyRepo = new CurrencyExtrangeRepository();
  }

  async convert(fromMoney: Money, toCurrency: Currencies) {
    const currencyMap = await this.currencyRepo.getCurrenies();
    if (!currencyMap) {
      throw new Error('failed to get latest currency list');
    }
    const from = currencyMap[fromMoney.getCurrency()];
    const to = currencyMap[toCurrency];
    if (!from || !to) {
      throw new Error('currency not found');
    }

    return fromMoney.convert(toCurrency, {
      endpoint: Promise.resolve({
        rate: to / from,
      }),
      propertyPath: 'rate',
    });
  }
}

export default CurrencyService;
