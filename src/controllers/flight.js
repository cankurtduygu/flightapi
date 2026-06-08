'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Flight Controller:

const Flight = require('../models/flight');
const passwordValidation = require('../helpers/passwordValidation');
const CustomError = require('../helpers/customError');
const { isAdmin, isStaffOrAdmin } = require('../middlewares/permissions');

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Flights"]
      #swagger.summary = "List Flights"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
    */

    const { departureDate } = req.query;
    const isAdminOrStaff = req.user.isAdmin || req.user.isStaff;

    let customFilter = isAdminOrStaff
      ? {}
      : {
          isPublished: true,
          status: { $in: ['scheduled', 'delayed'] },
          availableSeats: { $gt: 0 },
          departureDate: { $gte: new Date() },
        };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departureDate) {
      const departure = new Date(departureDate);
      if (isNaN(departure.getTime())) {
        throw new CustomError('Invalid departure date format.', 400);
      }
      if (!isAdminOrStaff && departure < today) {
        throw new CustomError('Departure date must be in the future.', 400);
      }

      departure.setHours(0, 0, 0, 0);

      const nextDay = new Date(departure); // departure'ın bir kopyasını oluşturduk
      nextDay.setDate(departure.getDate() + 1);
      customFilter.departureDate = {
        $gte: departure,
        $lt: nextDay,
      };
    }

    const data = await res.getModelList(
      Flight,
      [
        { path: 'createdId', select: 'username, email' },
        { path: 'updatedId', select: 'username, email' },
      ],
      customFilter
    );

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Flight, customFilter),
      data,
    });
  },

  read: async (req, res) => {
    /*
      #swagger.tags = ["Flights"]
      #swagger.summary = "Get Single Flight"
    */

    const isAdminOrStaff = req.user.isAdmin || req.user.isStaff;

    const data = await Flight.findOne({ _id: req.params.id }).populate([
      { path: 'createdId', select: 'username, email' },
      { path: 'updatedId', select: 'username, email' },
    ]);

    if (!data) {
      throw new CustomError('Flight not found.', 404);
    }

    if (
      !isAdminOrStaff &&
      (!data.isPublished ||
        !['scheduled', 'delayed'].includes(data.status) ||
        data.availableSeats <= 0 ||
        data.departureDate < new Date())
    ) {
      throw new CustomError(
        'You are not authorized to access this flight.',
        403
      );
    }

    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /* 
            #swagger.tags = ['Flights']
            #swagger.summary = 'Create Flight'
        */

    const departure = new Date(req.body.departureDate);
    const arrival = new Date(req.body.arrivalDate);

    const flightDay = new Date(departure);
    flightDay.setHours(0, 0, 0, 0);

    const nextDay = new Date(flightDay);
    nextDay.setDate(flightDay.getDate() + 1);

    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
      throw new CustomError('Invalid date format.', 400);
    }

    //! Compound index ve daha güçlü DB-level koruma YAP V2'de

    const existingFlight = await Flight.findOne({
      flightNumber: req.body.flightNumber,
      departureAirport: req.body.departureAirport,
      departureDate: {
        $gte: flightDay,
        $lt: nextDay,
      },
    });

    if (existingFlight) {
      throw new CustomError(
        'A flight with the same flight number, departure airport and departure date already exists.',
        400
      );
    }

    if (req.body.departureAirport == req.body.arrivalAirport) {
      throw new CustomError(
        'Departure and arrival airports must be different.',
        400
      );
    }

    if (departure >= arrival) {
      throw new CustomError('Arrival date must be after departure date.', 400);
    }

    req.body.availableSeats = req.body.capacity;

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    const result = await Flight.create(req.body);

    res.status(201).send({
      error: false,
      result,
    });
  },

  update: async (req, res) => {
    /*
      #swagger.tags = ["Flights"]
      #swagger.summary = "Update Flight"
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
    if (!req.user.isStaffOrAdmin && req.user._id !== req.params.id)
      throw new CustomError(
        'You are not authorized to access this resource',
        403
      );

    if (req.body.password) {
      passwordValidation(req.body.password);
    }

    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

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
