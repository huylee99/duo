const formatTime = (time: number) => {
  return `${time !== null && time < 10 ? "0" + time : time}:00`;
};

export { formatTime };
