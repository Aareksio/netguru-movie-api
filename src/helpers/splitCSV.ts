export default function splitCSV(csv: string): Array<string> {
  return csv.split(',').map(value => value.trim());
}
