const { calendar, oAuth2Client } = require("../config/googleAuth");

const createCalendarEvent = async (req, res) => {
    const { summary, description, startDateTime, durationInMinutes } = req.body;
    console.log(startDateTime);
  
    const event = {
      summary,
      description,
      location: "125 allée de Lauzard, 34980 Saint Gely du Fesc",
      start: {
        dateTime: new Date(startDateTime).toISOString(),
        timeZone: "Europe/Paris",
      },
      end: {
        dateTime: new Date(new Date(startDateTime).getTime() + durationInMinutes * 60000).toISOString(),
        timeZone: "Europe/Paris",
      },
    };
  
    try {
      const response = await calendar.events.insert({
        calendarId: "harmonessens@gmail.com",
        requestBody: event,
      });
      const { id, htmlLink } = response.data;
  
      res.status(200).json({
        success: true,
        message: "Événement créé avec succès.",
        eventId: id,
        eventLink: htmlLink,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de l'événement.",
        error: error.message,
      });
    }
  };

  const removeCalendarEvent = async (req, res) => {
    const { eventId } = req.body;
  
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "L'ID de l'événement est requis.",
      });
    }
  
    try {
      await calendar.events.delete({
        calendarId: "harmonessens@gmail.com",
        eventId,
      });
  
      res.status(200).json({
        success: true,
        message: "Événement supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'événement.",
        error: error.message,
      });
    }
  };
  
  module.exports = { createCalendarEvent, removeCalendarEvent };