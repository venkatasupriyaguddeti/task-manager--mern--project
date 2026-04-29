const globalErrorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Oops! Something Went Wrong!",
    status: err.status || 500,
  });
};

export default globalErrorHandler;
