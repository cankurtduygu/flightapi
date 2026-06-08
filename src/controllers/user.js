"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// User Controller:

const User = require("../models/user");
const passwordValidation = require("../helpers/passwordValidation");
const CustomError = require("../helpers/CustomError");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
    */

    const data = await res.getModelList(User);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },

  read: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User"
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri):
    if(req.user._id !== req.params.id) throw new CustomError("You are not authorized to access this resource", 403);

    const data = await User.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Create User'
        */

    const result = await User.create(req.body);

    res.status(201).send({
      error: false,
      result,
    });
  },

  update: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            "username": "test",
            "password": "1234",
            "email": "test@site.com",
            "isActive": true,
            "isStaff": false,
            "isAdmin": false,
        }
      }
    */

    //? Yetkisiz kullanıcının başka bir kullanıcıyı yönetmesini engelle (sadece kendi verileri): 
    if(!req.user.isAdmin && req.user._id !== req.params.id) throw new CustomError("You are not authorized to access this resource", 403);

    if (req.body.password) {
      passwordValidation(req.body.password);
    }

    const data = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    res.status(202).send({
      error: false,
      data,
    });
  },

 deletee: async (req, res) => {
    /* 
            #swagger.tags = ['Users']
            #swagger.summary = 'Delete User'
        */

    const result = await User.deleteOne({ _id: req.params.id });

    if (!result.deletedCount) {
      return res.status(404).send({
        error: true,
        message: 'Data is not found or already deleted.',
      });
    }

    res.sendStatus(204);
  },
};
