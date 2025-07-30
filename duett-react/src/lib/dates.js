const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-us');
}

export function getDateFromFormattedDate(date) {
  if (!date) return null;
  const [mm, dd, yyyy] = date.split('-');
  // month start from 0 for dates so need to subtract 1.
  return new Date(yyyy, +mm - 1, dd);
}

export function formatDateUs(date) {
  return new Intl.DateTimeFormat('en-US').format(date);
}

export function formatFrequency(frequency) {
  let ret;
  switch (frequency) {
    case 'Per Week':
      ret = 'week';
      break;
    case 'Per Month':
      ret = 'month';
      break;
    default:
      ret = 'week';
      break;
  }
  return ret;
}

export function timeAge(datetime) {
  const elapsed = new Date() - new Date(datetime);

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds old';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes old';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours old';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days old';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months old';
  } else {
    return Math.round(elapsed / msPerYear) + ' years old';
  }
}

export function hoursSinceNow(datetime) {
  const elapsed = new Date() - new Date(datetime);
  return Math.round(elapsed / msPerHour);
}
