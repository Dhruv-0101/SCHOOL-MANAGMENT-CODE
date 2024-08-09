//model,populate

const advancedResults = (model, populate) => {
  return async (req, res, next) => {
    let modelquery = model.find();
    //convert query strings to number
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const total = await model.countDocuments();
    console.log(total);
    console.log(page);
    const startIndex = (page - 1) * limit;
    console.log(startIndex);
    const endIndex = page * limit;
    console.log(endIndex);

    //populate
    if (populate) {
      modelquery = modelquery.populate(populate);
    }

    //Filtering/searching

    if (req.query.name) {
      modelquery = modelquery.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }

    //pagination results
    const pagination = {};
    //add next
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    //add prev
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    // //Execute query
    const models = await modelquery.find().skip(skip).limit(limit);

    res.results = {
      total,
      pagination,
      results: models.length,
      status: "success",
      message: "models fetched successfully",
      data: models,
    };

    next();
  };
};

module.exports = advancedResults;
