const router = require('koa-router')();
const UserController = require('../controllers/user');

router.prefix('/api/v1');

router.post('/user/create', UserController.create);
router.post('/user/findUserForId', UserController.findUserForId);
router.post('/user/findUserAllUser', UserController.findUserAllUser);
router.post('/user/uploadFile', UserController.uploadFile);
router.post('/user/uploadFiles', UserController.uploadFiles);
router.get('/', function (ctx) {
    ctx.body = "成功"
});

module.exports = router;
