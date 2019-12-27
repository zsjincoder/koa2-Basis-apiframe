const router = require('koa-router')();
const Reptile = require('../controllers/reptile');

router.prefix('/api/v1');

router.get('/reptile/getRanking',Reptile.getRanking);
router.get('/reptile/getDownUrl',Reptile.getDownUrl);
router.get('/reptile/getDPCQText',Reptile.getDPCQText);

module.exports = router;