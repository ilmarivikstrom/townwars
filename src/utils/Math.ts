export function formatCompactNumber(number: number) {
  number = Math.round(number);
  if (number >= 1000) {
    const thousands = number / 1000;
    return thousands.toFixed(1) + "k";
  }
  return number.toString();
}
