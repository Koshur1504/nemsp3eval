const express = require("express");
const { PORT } = require("./config/variables");
const { connection } = require("./config/connection");
const { userRouter } = require("./routes/user.router");
const { taskRouter } = require("./routes/taskRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/tasks", taskRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("db connected");
    console.log(`Server started on port ${PORT}`);
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
});
