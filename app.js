require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

const express = require("express");
const path = require("node:path");
const app = express();

const {
  formatRange,
  toSentenceCase,
  toTitleCase,
} = require("./utils/formatUtils");
app.locals.formatRange = formatRange;
app.locals.toSentenceCase = toSentenceCase;
app.locals.toTitleCase = toTitleCase;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const yarnsRouter = require("./routes/yarnsRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/yarns", yarnsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.post("/verify-password", confirmPassword, (req, res) =>
  res.sendStatus(204),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
