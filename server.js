// Dependencies
const express = require("express");
const app = express();
const path = require("path");

// Configuration
const PORT = 4000;
const methodOverride = require("method-override");

// Data
const Budget = require("./models/budget.js");

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Static
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// HOME BASE
app.get("/", (req, res) => {
  res.send("Home Base");
});

// INDEX
app.get("/budgets", (req, res) => {
  res.render("index.ejs", {
    Budget: Budget,
    bankAccount: Budget.reduce((a, b) => {
        // reduce takes whats on the left and compares it to whats on the right, and return value, first parameter is current total and b is next index in the array
      return a + b.amount;
    }, 0),
  });
});

// NEW
app.get("/budgets/new", (req, res) => {
  res.render("new");
});

// CREATE
app.post("/budgets", (req, res) => {
  const { date, name, from, amount, tags } = req.body;
  Budget.push({ date, name, from, amount, tags });
  res.redirect("/budgets");
});

// SHOW
app.get("/budgets/:index", (req, res) => {
  res.render("show.ejs", {
    ...Budget[req.params.index],
    index: req.params.index,
  });
});

// UPDATE
app.put("/budgets/:index", (req, res) => {
  Budget[req.params.index] = req.body; //in our budget array, find the index that is specified in the url (:index).  Set that element to the value of req.body (the input data)
  res.redirect(`/budgets/${req.params.index}`); //redirect to the index page
});

app.get("/budgets/:index/edit", (req, res) => {
  res.render("edit.ejs", {
    ...Budget[req.params.index],
    index: req.params.index,
  });
});

// DELETE
app.delete("/budgets/:index", (req, res) => {
  Budget.splice(req.params.index, 1); //remove the item from the array
  res.redirect("/budgets"); //redirect back to index route
});

app.listen(PORT, () => {
  console.log("Listening on PORT 4000");
});
