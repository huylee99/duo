const formatTime = (time: number) => {
  return `${time !== null && time < 10 ? "0" + time : time}:00`;
};

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export { formatTime, formatDate };
