var crypto = require("crypto");
export var encrypt = input => {
  let result = crypto
    .createHmac("sha256", "jc10")
    .update(input)
    .digest("hex");
  return result;
};
export const timeSince = date => {
  var t = date.split(/[- T Z :]/);
  var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
  var seconds = Math.floor((new Date() - d) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval + " minutes ago";
  } else {
    return "just now";
  }
};
