import { Context } from 'koa';
import Joi from '@hapi/joi';
import { PaymentType } from '../entities/types';
import { InvalidRequestError } from './Errors';
import TransfersService from '../services/Transfers';
import { dtoTransformer, TransferToDTO } from './Dtos';

const TransferRequestSchema = Joi.object({
  from: Joi.number().min(0).integer().required(),
  to: Joi.number().min(0).integer().required(),
  fromType: Joi.string()
    .valid(...Object.values(PaymentType))
    .required(),
  toType: Joi.string()
    .valid(...Object.values(PaymentType))
    .required(),
  amount: Joi.number()
    .integer()
    .min(0)
    .max(2 ** 31 / 100)
    .required(),
  // transferCurrency: Joi.string().valid('from', 'to').required(),
});

class TransferController {
  transferService: TransfersService;
  constructor() {
    this.transferService = new TransfersService();
  }
  create = async (ctx: Context) => {
    const { error, value } = await TransferRequestSchema.validate(
      ctx.request.body
    );
    if (error) {
      throw new InvalidRequestError(error.message);
    }
    const { user } = ctx.state;
    try {
      const rslt = await this.transferService.create(user, value);
      ctx.status = 200;
      ctx.body = dtoTransformer(rslt, TransferToDTO);
    } catch (err) {
      if (
        /insufficient fund/.test(err.message) ||
        /method not found/.test(err.message) ||
        /method is invalid/.test(err.message) ||
        /invalid transfer/.test(err.message)
      ) {
        ctx.status = 400;
        ctx.body = err.message;
      } else {
        ctx.status = 500;
        ctx.body = err.message;
      }
    }
  };
}

export default new TransferController();
