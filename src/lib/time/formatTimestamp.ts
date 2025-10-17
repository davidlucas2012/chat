const formatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export function formatTimestamp(timestamp: number): string {
  return formatter.format(new Date(timestamp));
}
