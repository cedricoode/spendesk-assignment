import { Context } from 'koa';

class CardsController {
  create = async (ctx: Context) => {
    ctx.status = 200;
  };
  get = async (ctx: Context) => {
    ctx.status = 200;
  };

  list = async (ctx: Context) => {
    ctx.status = 200;
  };

  block = async (ctx: Context) => {
    ctx.status = 200;
  };

  unblock = async (ctx: Context) => {
    ctx.status = 200;
  };
}

export default new CardsController();
