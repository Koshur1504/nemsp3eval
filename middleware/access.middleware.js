const access = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(401).send({ msg: "Un-Authorized234" });
    }
  };
};

module.exports = { access };
