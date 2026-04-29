const notFound = (req, res, next) => {
  const err = new Error("Page/Resource Does Not Exist");
  err.status = 404;
  next(err);
};

export default notFound;
