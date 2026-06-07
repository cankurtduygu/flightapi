"use strict";

module.exports = async (req, res, next) => {

  //* Filter:
  // URL?filter[fieldName]=value1&filter[fieldName2]=value2
  const filter = req.query?.filter || {};

  //* Search:
  // URL?search[fieldName]=value1&search[fieldName2]=value2
  const search = req.query?.search || {};

  for (let key in search) search[key] = { $regex: search[key], $options: "i" };

  //* Sorting:
  // URL?sort[fieldName]=value1&sort[fieldName2]=value2
  const sort = req.query?.sort || {};

  //? PAGINATION:
  // URL?page=3&limit=10&skip=20

  //* Page:
  let page = parseInt(req.query?.page);
  page = page > 0 ? page : 1;

  //* Limit:
  let limit = parseInt(req.query?.limit);
  limit = limit > 0 ? limit : 20;

  //* Skip:
  let skip = parseInt(req.query?.skip);
  skip = skip > 0 ? skip : (page - 1) * limit;

  res.getModelList = async (Model, populate = null, customFilter = {}) => {
    return await Model.find({ ...filter, ...search, ...customFilter })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  res.getModelListDetails = async (Model, customFilter = {}) => {
    const count = await Model.countDocuments({ ...filter, ...search, ...customFilter });
    return {
      count,
      filter,
      search,
      page,
      skip,
      limit,
      sort,
      pages:
        count <= limit
          ? false
          : {
              previos: page > 1 ? page - 1 : false,
              current: page,
              next: page < Math.ceil(count / limit) ? page + 1 : false,
              total: Math.ceil(count / limit),
            },
    };
  };

  next();
};
