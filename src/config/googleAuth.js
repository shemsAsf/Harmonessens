const { google } = require("googleapis");
const path = require("path");

const keyPath = path.join(__dirname, "./GoogleAuth.json");
const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
});

const oAuth2Client = auth.fromJSON(require(keyPath));
google.options({ auth: oAuth2Client });

module.exports = { calendar: google.calendar("v3"), oAuth2Client };
