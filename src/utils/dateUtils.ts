const MONTHS_FA = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر',
];

function pad(n: number): string {
  return n < 10 ? `۰${toFa(n)}` : toFa(n);
}

function toFa(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

/** "۲ دقیقه پیش" / "چند لحظه پیش" / "۱ ساعت پیش" */
export function timeAgoFa(date: Date | number): string {
  const ts = typeof date === 'number' ? date : date.getTime();
  const diff = Math.max(0, Date.now() - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return 'چند لحظه پیش';
  if (sec < 60) return `${toFa(sec)} ثانیه پیش`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${toFa(min)} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${toFa(hr)} ساعت پیش`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${toFa(days)} روز پیش`;
  return fullDateFa(new Date(ts));
}

/** "۱۱ اوت ۲۰۲۶، ۲۱:۳۰" */
export function fullDateFa(date: Date): string {
  const d = date.getDate();
  const month = MONTHS_FA[date.getMonth()];
  const year = date.getFullYear();
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  return `${toFa(d)} ${month} ${toFa(year)}، ${h}:${m}`;
}

/** "امروز، ۲۱:۴۵" / "دیروز، ۱۴:۰۲" / full date */
export function shortDateTimeFa(date: Date): string {
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (sameDay) return `امروز، ${time}`;
  if (isYesterday) return `دیروز، ${time}`;
  return fullDateFa(date);
}
