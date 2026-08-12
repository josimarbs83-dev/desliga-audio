const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), "index.html");

  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      res.statusCode = 500;
      return res.end("Erro ao carregar o DESLIGA.");
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.statusCode = 200;
    res.end(html);
  });
};
