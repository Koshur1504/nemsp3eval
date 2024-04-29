const {
  createTask,
  getTasks,
  patchTask,
  deleteTask,
  getSingleTask,
} = require("../controler/task.controller");
const { access } = require("../middleware/access.middleware");
const { auth } = require("../middleware/auth.middleware");

const taskRouter = require("express").Router();

taskRouter.post("/", auth, access("manager", "member"), createTask);
taskRouter.get("/", auth, access("manager", "member", "admin"), getTasks);
taskRouter.get(
  "/:taskID",
  auth,
  access("manager", "member", "admin"),
  getSingleTask
);
taskRouter.patch("/:taskID", auth, access("manager", "member"), patchTask);
taskRouter.delete("/:taskID", auth, access("manager", "member"), deleteTask);
module.exports = { taskRouter };
