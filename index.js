require("dotenv").config();

const readline = require("readline");
const nodemailer = require("nodemailer");

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const SEND_TO_EMAILS = ["someemail@email.com"];

const transport = {
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  },
  tls: {
    ciphers: "SSLv3"
  }
};
const transporter = nodemailer.createTransport(transport);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", function(line) {
  allocatePortToStudent(line);
});

const assignedPortNumbers = new Set();
const studentNumberList = new Map();

function allocatePortToStudent(studentNumber) {
  if (!isStudentNumber(studentNumber)) {
    console.error("needs to be a valid student number");
    return;
  }
  if (studentNumberList.has(studentNumber)) {
    console.error("student already assigned a port number");
    return;
  }

  const duoPortNumbers = [];

  while (duoPortNumbers.length !== 2) {
    const randomPortNumber = getRandomIntInclusive(61000, 61999);
    if (!assignedPortNumbers.has(randomPortNumber)) {
      duoPortNumbers.push(randomPortNumber);
    }
  }

  studentNumberList.set(studentNumber, duoPortNumbers);

  sendEmail(
    "Network Programming (2020) Port Allocation For Student",
    "Port Allocation for Student",
    `Student Number: ${studentNumber}, Port Allocation: ${duoPortNumbers[0]} , ${duoPortNumbers[1]}`,
    SEND_TO_EMAILS
  ).then(() => {});

  console.log(
    `port number assigned to student ${studentNumber} : ${duoPortNumbers}`
  );
}

function isStudentNumber(studentNumber) {
  const regex = new RegExp("^[0-9]{7}$");
  return studentNumber.match(regex);
}

//The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendEmail(subject, subheader, body, toEmails, bccToEmails) {
  const mailOptions = {
    from: `"${EMAIL_USERNAME}" <${EMAIL_USERNAME}>`, // sender address
    to: toEmails, // list of receivers
    subject: `${subject}`, // Subject line
    html: body // html body
  };
  if (bccToEmails) {
    mailOptions.bcc = bccToEmails;
  }

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);
  const acceptedReceivers = info.accepted;
  const rejectedReceivers = info.rejected;
  const messageId = info.messageId;
  return info;
}
