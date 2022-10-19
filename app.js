const express = require("express");
const { request } = require("https");
const fsPromise = require("fs").promises;

const PORT = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.json());

// Synchronous error is not handled by express
app.get("/", (req, res) => {
  throw new Error("Hello error!");
});

// Asynchronous error is not handled by express
app.get("/file", async (req, res, next) => {
  try {
    const file = await fsPromise.readFile("./no-such-file.txt");
    res.sendFile(file);
  } catch (error) {
    error.type = "Redirect";
    next(error);
  }
});

app.get("/text", async (req, res, next) => {
  try {
    const file = await fsPromise.readFile("./no-such-file.txt");
    res.sendFile(file);
  } catch (error) {
    error.type = "Not Found";
    next(error);
  }
});

app.get("/user", async (req, res, next) => {
  try {
    const file = await fsPromise.readFile("./no-such-file.txt");
    res.sendFile(file);
  } catch (error) {
    error.type = "Redirect";
    next(error);
  }
});

// Handle asynchronous error using error middleware
app.use((error, req, res, next) => {
  console.log("Error Handling Middleware called");
  console.log("Path", req.path);
  console.log("Error", error);

  if (error.type == "Redirect") res.redirect("error.html");
  else if (error.type == "Not Found")
    //arbitrary condition check
    res.status(404).send("File Not Found!");
  else {
    request.status(500).send(error);
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
