const fs = require("fs");
const handlebars = require("handlebars");
const pdf = require("html-pdf");

module.exports = {
  pdfcreate: (html, replacements, option, cb) => {
    fs.readFile(html, { encoding: "utf-8" }, (err, readHTML) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        var template = handlebars.compile(readHTML);
        var HTMLtoPDF = template("replacements");

        pdf.create(HTMLtoPDF, options).toStream((err, stream) => {
          if (err) {
            console.log(err);
            return cb(stream);
          } else {
            return cb(stream);
          }
        });
      }
    });
  }
};
