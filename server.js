const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// ✅ Middleware for JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// ✅ Routes to load HTML pages directly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// ✅ Register route
app.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = { firstName, lastName, email, password };
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  let users = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    users = data.length ? JSON.parse(data) : [];
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });

  }

  users.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users));
  res.send("Registration successful");
});

// ✅ Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).send("No registered users found.");
  }

  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid email or password");
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});