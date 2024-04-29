const {
  registerUser,
  loginUser,
  logoutUser,
  manageAccess,
  getUsers,
  getsingleUser,
} = require("../controler/user.controller");
const { access } = require("../middleware/access.middleware");
const { auth } = require("../middleware/auth.middleware");

const userRouter = require("express").Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", auth, logoutUser);
userRouter.get("/", auth, access("admin"), getUsers);
userRouter.get("/:userID", auth, access("admin"), getsingleUser);
userRouter.patch("/manage", auth, access("admin"), manageAccess);

module.exports = { userRouter };
