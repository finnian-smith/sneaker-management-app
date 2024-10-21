import express from "express";
import sneakerRouter from "./routes/sneakerRouter.js";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", sneakerRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}.`));
