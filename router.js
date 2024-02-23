const express = require("express");
const app = express();
const path= require("path");
const port = 3000;

app.use("/", express.static(__dirname));

app.get("/", (req, resp) => {
    resp.sendFile(path.join(public, "/index.html"));
})

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
  })