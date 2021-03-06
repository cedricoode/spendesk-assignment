import got from 'got';
import config from 'config';
import * as helper from '../helper';
import { FixerIOResponse } from '../entities/types';
import { createLogger } from '../logger';

const logger = createLogger('CurrencyExchangeRepository');
const Fixed = {
  success: true,
  timestamp: 1593016565,
  base: 'EUR',
  date: '2020-06-24',
  rates: {
    AED: 4.139886,
    AFN: 86.902294,
    ALL: 124.377595,
    AMD: 541.106105,
    ANG: 2.023667,
    AOA: 659.858133,
    ARS: 78.998199,
    AUD: 1.639452,
    AWG: 2.028808,
    AZN: 1.914572,
    BAM: 1.950148,
    BBD: 2.276317,
    BDT: 95.632544,
    BGN: 1.954931,
    BHD: 0.425589,
    BIF: 2152.791237,
    BMD: 1.127116,
    BND: 1.565645,
    BOB: 7.784778,
    BRL: 5.986334,
    BSD: 1.127425,
    BTC: 0.000121,
    BTN: 85.244695,
    BWP: 13.248298,
    BYN: 2.675205,
    BYR: 22091.470288,
    BZD: 2.272578,
    CAD: 1.53427,
    CDF: 2133.630513,
    CHF: 1.06772,
    CLF: 0.033499,
    CLP: 924.581314,
    CNY: 7.9775,
    COP: 4200.986125,
    CRC: 652.364939,
    CUC: 1.127116,
    CUP: 29.86857,
    CVE: 110.685317,
    CZK: 26.726158,
    DJF: 200.715153,
    DKK: 7.454158,
    DOP: 65.992507,
    DZD: 145.16688,
    EGP: 18.238932,
    ERN: 16.906837,
    ETB: 38.783778,
    EUR: 1,
    FJD: 2.441277,
    FKP: 0.906693,
    GBP: 0.906663,
    GEL: 3.454621,
    GGP: 0.906693,
    GHS: 6.52591,
    GIP: 0.906693,
    GMD: 58.215277,
    GNF: 10825.948054,
    GTQ: 8.669937,
    GYD: 235.777766,
    HKD: 8.735655,
    HNL: 27.919894,
    HRK: 7.571306,
    HTG: 122.044226,
    HUF: 351.908313,
    IDR: 15991.857546,
    ILS: 3.872578,
    IMP: 0.906693,
    INR: 85.310327,
    IQD: 1341.267839,
    IRR: 47457.212569,
    ISK: 156.995845,
    JEP: 0.906693,
    JMD: 157.307848,
    JOD: 0.799096,
    JPY: 120.417643,
    KES: 119.970346,
    KGS: 84.42988,
    KHR: 4583.980341,
    KMF: 490.915366,
    KPW: 1014.474326,
    KRW: 1358.698616,
    KWD: 0.346836,
    KYD: 0.939546,
    KZT: 453.17953,
    LAK: 10180.555372,
    LBP: 1702.544977,
    LKR: 210.377466,
    LRD: 224.436954,
    LSL: 19.54479,
    LTL: 3.32808,
    LVL: 0.681781,
    LYD: 1.592299,
    MAD: 10.868215,
    MDL: 19.560904,
    MGA: 4336.014352,
    MKD: 61.495814,
    MMK: 1560.356166,
    MNT: 3176.692868,
    MOP: 9.000971,
    MRO: 402.380741,
    MUR: 45.253459,
    MVR: 17.368665,
    MWK: 828.430247,
    MXN: 25.628776,
    MYR: 4.822366,
    MZN: 78.864829,
    NAD: 19.544435,
    NGN: 436.756114,
    NIO: 39.11637,
    NOK: 10.886316,
    NPR: 136.392975,
    NZD: 1.758075,
    OMR: 0.433908,
    PAB: 1.127425,
    PEN: 3.978499,
    PGK: 3.885731,
    PHP: 56.440357,
    PKR: 189.270965,
    PLN: 4.458303,
    PYG: 7579.280284,
    QAR: 4.104111,
    RON: 4.841975,
    RSD: 117.581209,
    RUB: 78.353256,
    RWF: 1070.760039,
    SAR: 4.228651,
    SBD: 9.392018,
    SCR: 19.822475,
    SDG: 62.357713,
    SEK: 10.524893,
    SGD: 1.5693,
    SHP: 0.906693,
    SLL: 10983.743237,
    SOS: 655.412804,
    SRD: 8.40607,
    STD: 24853.294658,
    SVC: 9.865342,
    SYP: 578.226839,
    SZL: 19.544194,
    THB: 34.793888,
    TJS: 11.618147,
    TMT: 3.956177,
    TND: 3.209466,
    TOP: 2.567851,
    TRY: 7.728975,
    TTD: 7.623217,
    TWD: 33.284632,
    TZS: 2612.654577,
    UAH: 30.062338,
    UGX: 4216.6137,
    USD: 1.127116,
    UYU: 47.706148,
    UZS: 11473.857746,
    VEF: 11.257065,
    VND: 26222.913367,
    VUV: 131.457348,
    WST: 3.001682,
    XAF: 654.059918,
    XAG: 0.064187,
    XAU: 0.000639,
    XCD: 3.046087,
    XDR: 0.816144,
    XOF: 654.295824,
    XPF: 119.98128,
    YER: 282.173335,
    ZAR: 19.617733,
    ZMK: 10145.397999,
    ZMW: 20.468706,
    ZWL: 362.931299,
  },
};

let cached: FixerIOResponse = null;
class CurrencyExchangeRepository {
  constructor() {}

  async getCurrenies() {
    if (config.get('env') === 'test') {
      // TODO: this should be moved to test mock file.. for the moment it's ok to use it
      return helper.currencyListToMap(Fixed);
    }
    // 1. check memory cache if more than two hours, rerequest.
    let rslt;
    if (
      cached &&
      new Date(cached.timestamp * 1000 + 120 * 3600 * 1000).getTime() >=
        Date.now()
    ) {
      rslt = cached;
    } else {
      // cache is stale, rerequest
      try {
        logger.info('using memory cache');
        cached = await got(
          `http://data.fixer.io/api/latest?access_key=${config.get(
            'fixerio.accessKey'
          )}`
        ).json<FixerIOResponse>();
        rslt = cached;
      } catch (err) {
        logger.error(
          'failed to get newest exchange rate, using potentially staled one'
        );
        logger.error(err);
        // fall to use a potentially stale one
        rslt = Fixed;
      }
    }

    return helper.currencyListToMap(rslt);
  }
}

export default CurrencyExchangeRepository;
