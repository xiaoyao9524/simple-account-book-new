export function formatDate(dateObj: Date, delimiter: string = '-'): string {
  const year = dateObj.getFullYear();
  const monthNum = dateObj.getMonth() + 1;
  const month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
  const dateNum = dateObj.getDate();
  const date = dateNum < 10 ? `0${dateNum}` : `${dateNum}`;
  return `${year}${delimiter}${month}${delimiter}${date}`;
}
