export const getValidDateTime = (date, time) => {
    const [hour, minute] = time.split(" - ")[0].split(":").map(num => num.padStart(2, "0"));
    return `${getLocalDate(date).toISOString().split('T')[0]}T${hour}:${minute}:00`;
};

export const getLocalDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

export const FormatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + "h" : ""} ${mins > 0 ? mins + "min" : ""}`;
};
  