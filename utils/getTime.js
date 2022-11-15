import moment from "moment";

export default function getTime(time) {
  const date = moment(time);

  const now = moment();

  const yesterday = moment().subtract(1, "days");
  const dateWeekAgo = moment().subtract(5, "days");

  if (date.isSame(now, "day")) {
    return "Today";
  } else if (date.isSame(yesterday, "day")) {
    return "Yesterday";
  } else if (date.isAfter(dateWeekAgo)) {
    return date.format("dddd");
  } else if (date.isSame(now, "month")) {
    return date.format("ddd d. MMM");
  } else if (date.isSame(now, "year")) {
    return date.format("ddd d. MMM");
  } else {
    return date.format("d. MMM. YYYY");
  }
}
