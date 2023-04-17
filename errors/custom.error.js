exports.customError = (error, request, response, next) => {
  if (error.msg) {
    response.status(error.code).send({ error: error.msg });
  }
  next(error);
};
