function logger(req, res, next) {
  const { method, url, headers, body } = req;
  console.log({ method, url, headers, body });
  next();
}

export default logger;
