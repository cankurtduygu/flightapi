'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router();
const { isLogin, isAdmin } = require('../middlewares/permissions');
const { list, create, read, update, deletee } = require('../controllers/user');

// URL: /users

router.route('/')
      .get(isAdmin, list)
      .post(isLogin, create);

router
  .route('/:id')
  .get(isLogin, read)
  .put(isLogin, update)
  .patch(isLogin, update)
  .delete(isAdmin, deletee);

/* ------------------------------------------------------- */
module.exports = router;
