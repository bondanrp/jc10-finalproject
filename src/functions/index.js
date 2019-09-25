var crypto = require("crypto");
export var encrypt = input => {
  let result = crypto
    .createHmac("sha256", "jc10")
    .update(input)
    .digest("hex");
  return result;
};
