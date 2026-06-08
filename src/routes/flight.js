'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const router = require('express').Router();
const { isLogin, isAdmin, isStaffOrAdmin } = require('../middlewares/permissions');
const { list, create, read, update, deletee } = require('../controllers/flight');

// URL: /flights

router.route('/')
      .get(isLogin, list)
      .post(isLogin, isStaffOrAdmin, create);

router
  .route('/:id')
  .get(isLogin, read)
  .put(isLogin, isStaffOrAdmin, update)
  .patch(isLogin, isStaffOrAdmin, update)
  .delete(isLogin, isStaffOrAdmin, deletee);

/* ------------------------------------------------------- */
module.exports = router;
