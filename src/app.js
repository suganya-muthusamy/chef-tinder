const express = require("express");
const app = express();

//  here if we use "/" - first, the other two wont work. so put the root directory alway under
//  otherwise try using app.get()
// app.use("/test", (req, res) => {
//   res.send("test server");
// });
// app.use("/api", (req, res) => {
//   res.send("API server");
// });
// app.use("/", (req, res) => {
//   res.send("homepage server");
// });
app.get("/", (req, res) => {
  res.send("homepage server");
});
app.get("/test", (req, res) => {
  res.send("test server");
});
app.get("/api", (req, res) => {
  res.send("API server");
});

app.listen(3000);
