import { Context } from 'koa';

class TransferController {
  create = async (ctx: Context) => {
    ctx.status = 200;
  };
}

export default new TransferController();
