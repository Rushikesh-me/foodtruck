const nodemailer = require("nodemailer");
const config = require("./config");

const user = config.EMAIL;
const pass = config.PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});