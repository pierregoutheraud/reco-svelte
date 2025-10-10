export function convertMinsToHrsMins(m: number) {
  const numberOfHours = Math.floor(m / 60);
  const numberOfMinutes = m % 60;
  const hours =
    numberOfHours > 0 ? String(numberOfHours).padStart(1, "0") + "h" : "";
  const minutes = String(numberOfMinutes).padStart(2, "0") + "m";
  return `${hours} ${minutes}`;
}
