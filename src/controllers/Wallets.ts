import { Context } from 'koa';
import Joi from '@hapi/joi';
import { createLogger } from '../logger';
import { InvalidRequestError } from './Errors';
import WalletService from '../services/Wallet';
import { Currencies } from '../entities/types';
import { dtoTransformer, WalletToDTO, dtoArrayTransformer } from './Dtos';

const logger = createLogger('WalletsController');

const CreateWalletSchema = Joi.object({
  balance: Joi.number()
    .integer()
    .min(0)
    .max(2 ** 31 / 100)
    .required(),
  currency: Joi.string()
    .valid(...Object.values(Currencies))
    .required(),
  isMaster: Joi.bool().default(false),
}).required();

class WalletsController {
  walletService: WalletService;
  constructor() {
    this.walletService = new WalletService();
  }

  create = async (ctx: Context) => {
    const { value, error } = await CreateWalletSchema.validate(
      ctx.request.body
    );
    if (error) {
      logger.info('failed input validation');
      throw new InvalidRequestError(error.message);
    }
    // process value
    const { user } = ctx.state;

    try {
      const rslt = await this.walletService.createWallet(user, value);
      ctx.status = 200;
      ctx.body = dtoTransformer(rslt, WalletToDTO);
    } catch (err) {
      logger.error('failed to create wallet');
      logger.error(err);
      ctx.status = 400;
      ctx.body = err.message;
    }
  };

  list = async (ctx: Context) => {
    const { user } = ctx.state;
    try {
      const rslt = await this.walletService.getCompanyWallets(user.company);
      ctx.status = 200;
      ctx.body = dtoArrayTransformer(rslt, WalletToDTO);
    } catch (err) {
      ctx.status = 400;
      // handle error;
      logger.error(err);
    }
  };

  get = async (ctx: Context) => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const rslt = await this.walletService.getCompanyWallet(user.company, id);
    if (!rslt) {
      ctx.status = 404;
      return;
    }
    ctx.status = 200;
    ctx.body = dtoTransformer(rslt, WalletToDTO);
  };
}
export default new WalletsController();
