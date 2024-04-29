const { default: mongoose } = require("mongoose");
const { TaskModel } = require("../model/task.model");

exports.createTask = async (req, res) => {
  const { username, _id: userID } = req.user;
  try {
    const obj = { ...req.body, username, userID };
    const task = new TaskModel(obj);
    await task.save();
    return res.status(201).send({ msg: "Task Created", task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getTasks = async (req, res) => {
  const { role, _id } = req.user;
  const { today } = req.query;
  const query = {};
  if (today == 1) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: startOfToday, $lte: endOfToday };
  }
  try {
    const tasks =
      role == "member"
        ? await TaskModel.find({ userID: _id, ...query })
        : await TaskModel.find(query);
    res.status(200).send({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.getSingleTask = async (req, res) => {
  const { role, _id } = req.user;
  const { taskID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskID)) {
      return res.status(400).send({ msg: "Invalid taskID" });
    }
    const task = await TaskModel.findById(taskID);
    if (!task) return res.status(400).send({ msg: "Task not found" });
    console.log(_id, task.userID);
    console.log(_id == task.userID);
    if (role == "member" && !task.userID.equals(_id)) {
      return res.status(401).send({ msg: "Un-Authorized" });
    }
    return res.status(200).send({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.patchTask = async (req, res) => {
  const { role, _id } = req.user;
  const { taskID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskID)) {
      return res.status(400).send({ msg: "Invalid taskID" });
    }
    const task = await TaskModel.findById(taskID);
    if (!task) return res.status(400).send({ msg: "Task not found" });
    if (role == "member" && !task.userID.equals(_id))
      return res.status(401).send({ msg: "Un-Authorized" });
    Object.assign(task, req.body);
    task.save();
    return res.status(200).send({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  const { role, _id } = req.user;
  const { taskID } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskID)) {
      return res.status(400).send({ msg: "Invalid taskID" });
    }
    const task = await TaskModel.findById(taskID);
    if (!task) return res.status(400).send({ msg: "Task not found" });
    if (role == "member") {
      if (!task.userID.equals(_id)) {
        return res.status(401).send({ msg: "Un-Authorized" });
      } else {
        Object.assign(task, { deleteMarked: true });
        await task.save();
        return res.status(200).send({ msg: "Marked for deletion" });
      }
    } else {
      if (task.deleteMarked) {
        await task.deleteOne();
        return res.status(200).send({ msg: "Deleted" });
      } else {
        return res.status(200).send({ msg: "Needs to be marked as deleted" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};
