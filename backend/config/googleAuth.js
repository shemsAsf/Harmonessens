require('dotenv').config();
const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  credentials: {
    private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GCLOUD_CLIENT_EMAIL
  },
  scopes: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
});

const oAuth2Client = auth.fromJSON({
  type: 'service_account',
  project_id: process.env.GCLOUD_PROJECT_ID,
  private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GCLOUD_CLIENT_EMAIL,
});

google.options({ auth: oAuth2Client });

module.exports = { calendar: google.calendar("v3"), oAuth2Client };
