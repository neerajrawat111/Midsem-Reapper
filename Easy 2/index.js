const express = require("express");
const app = express();


app.get("/protected", (req, res) => {
  // TODO: Send the response: Access granted at <timestamp>
  
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
