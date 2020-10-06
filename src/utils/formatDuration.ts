function leadingZero(input: number): string {
  if (input < 10) {
    return `0${input}`;
  }

  return input.toString();
}

function formatDuration(ms: number): string {
  const totalSeconds = ms / 1000;
  const totalMinutes = totalSeconds / 60;
  const hours = Math.floor(totalMinutes / 60);

  const seconds = Math.round(totalSeconds % 60);
  const minutes = Math.floor(totalMinutes % 60);

  if (hours > 0) {
    return `${hours}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
  }

  return `${minutes}:${leadingZero(seconds)}`;
}

export default formatDuration;
