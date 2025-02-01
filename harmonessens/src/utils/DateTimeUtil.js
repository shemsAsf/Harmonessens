export const getValidDateTime = (date, time) => {
    const [hour, minute] = time.split(" - ")[0].split(":").map(num => num.padStart(2, "0"));
    return `${getLocalDate(date).toISOString().split('T')[0]}T${hour}:${minute}:00`;
};

export const getLocalDate = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};