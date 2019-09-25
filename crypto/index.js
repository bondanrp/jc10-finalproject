var crypto = require("crypto");

var encrypt = input => {
  let result = crypto
    .createHmac("sha256", "jc10")
    .update(password)
    .digest("hex");
  return result;
};
