import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import fileUpload from "express-fileupload";
import { initAssociations } from "@config/associations";
import { connectToDB } from "@database/index";

const app = express();
initAssociations();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(morgan("dev"));

connectToDB();

app.use("/", routes);

app.use((req, res) => {
  res.send({
    status: 200,
    message: "Hello",
  });
});

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  next();
});

app.use((req, res) => {
  res.status(404).send({
    status: 404,
    message: "Không tìm thấy đường dẫn",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT : ${PORT}`);
});
