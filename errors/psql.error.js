exports.psqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ error: "invalid id" });
  } else if (error.code === "23503") {
    response.status(404).send({ error: "not found" });
  } else if (error.code === "23502") {
    response.status(400).send({ error: "missing required field(s)" });
  }
  next(error);
};
