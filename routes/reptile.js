const router = require('koa-router')();
const Reptile = require('../controllers/reptile');

router.prefix('/api/v1');

router.get('/reptile/getMovieRanking',Reptile.getMovieRank);

module.exports = router;