import { Context } from 'koa';
import CardsService from '../services/Cards';
import logger from '../logger';
import Joi from '@hapi/joi';
import { InvalidRequestError } from './Errors';
import { dtoTransformer, CardToDTO, dtoArrayTransformer } from './Dtos';

class CardsController {
  cardsService: CardsService;
  constructor() {
    this.cardsService = new CardsService();
  }
  create = async (ctx: Context) => {
    const { id: walletId } = ctx.params;
    const { error } = await Joi.number()
      .required()
      .min(0)
      .error(() => new Error('invalid wallet id!'))
      .validate(walletId);
    if (error) {
      logger.info(`invalid wallet id: ${walletId} `);
      throw new InvalidRequestError(error.message);
    }

    const { user } = ctx.state;
    try {
      const card = await this.cardsService.create(user, walletId);
      ctx.status = 200;
      ctx.body = dtoTransformer(card, CardToDTO);
    } catch (err) {
      logger.error('failed to create card');
      logger.error(err);
      ctx.status = 400;
      ctx.body = err.message;
    }
  };
  get = async (ctx: Context) => {
    const { id } = ctx.params;
    const { error } = await Joi.number()
      .required()
      .min(0)
      .error(() => new Error('invalid card id'))
      .validate(id);
    if (error) {
      throw new InvalidRequestError(error.message);
    }
    const { user } = ctx.state;

    const card = await this.cardsService.getUserCard(user, id);
    if (!card) {
      ctx.status = 404;
      return;
    }
    ctx.body = dtoTransformer(card, CardToDTO);
    ctx.status = 200;
  };

  list = async (ctx: Context) => {
    const { user } = ctx.state;
    const cards = await this.cardsService.getUserCards(user);
    if (!cards) {
      ctx.status = 404;
      return;
    }
    ctx.body = dtoArrayTransformer(cards, CardToDTO);
    ctx.status = 200;
  };

  block = async (ctx: Context) => {
    const { id } = ctx.params;
    const { error } = await Joi.number()
      .required()
      .min(0)
      .integer()
      .error(() => new Error('invalid card id'))
      .validate(id);
    if (error) {
      throw new InvalidRequestError(error.message);
    }
    const { user } = ctx.state;
    const rslt = this.cardsService.blockCard(user, id);
    if (rslt) {
      // successfully blocked
      ctx.status = 200;
      ctx.body = `card ${id} blocked `;
      return;
    }
    ctx.status = 204;
    ctx.bdy = `card ${id} already blocked`;
  };

  unblock = async (ctx: Context) => {
    const { id } = ctx.params;
    const { error } = await Joi.number()
      .required()
      .min(0)
      .integer()
      .error(() => new Error('invalid card id'))
      .validate(id);
    if (error) {
      throw new InvalidRequestError(error.message);
    }
    const { user } = ctx.state;
    const rslt = this.cardsService.unblockCard(user, id);
    if (rslt) {
      // successfully blocked
      ctx.status = 200;
      ctx.body = `card ${id} unblocked `;
      return;
    }
    ctx.status = 204;
    ctx.bdy = `card ${id} already unblocked`;
  };
}

export default new CardsController();
