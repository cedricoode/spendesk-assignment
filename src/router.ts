import Router from '@koa/router';
import errorHandler from './middlewares/requestErrorHandler';
import authMiddleware from './middlewares/auth';
import wallets from './controllers/Wallets';
import cards from './controllers/Cards';
import transfers from './controllers/Transfers';

const router = new Router({
  prefix: '/api',
});

router.use(errorHandler());

router.use(authMiddleware());

router.post('/wallets', wallets.create);
router.get('/wallets', wallets.list);
router.get('/wallets/:id', wallets.get);

router.post('/cards', cards.create);
router.get('/cards', cards.list);
router.get('/cards/:id', cards.get);
router.put('/cards/:id/block', cards.block);
router.put('/cards/:id/unblock', cards.unblock);
// router.patch('/cards/:id/recharge') # recharge is a transfer ?
router.post('/transfers', transfers.create);

export default router;
