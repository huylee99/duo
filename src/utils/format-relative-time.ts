import formatDistanceToNow from "date-fns/formatDistanceToNow";

const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export default formatRelativeTime;
