const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/variables");
const { UserModel } = require("../model/user.model");
const { BlacListModel } = require("../model/blacklist.model");

const auth = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  try {
    if (!accessToken) return res.status(401).send({ msg: "Please login" });

    const isBlacklisted = await BlacListModel.findOne({ accessToken });

    if (isBlacklisted) return res.status(401).send({ msg: "Please login" });
    jsonwebtoken.verify(accessToken, JWT_SECRET, async (error, decoded) => {
      if (error) return res.status(401).send({ msg: "Please login" });

      if (!decoded) return res.status(401).send({ msg: "Please login" });

      const user = await UserModel.findById(decoded._id);

      if (user.status == "disable")
        return res.status(200).send({ msg: "Your access disabled" });

      req.accessToken = accessToken;

      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = { auth };
