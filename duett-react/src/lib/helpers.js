export const getQueryStringValue = (key) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key);
  return value;
};

export const isMoreThanTwoWeeks = (date) => {
  if (!date) {
    return true;
  }
  const promptTime = new Date(date).getTime();
  const currentTime = new Date().getTime();
  let differenceInMs = currentTime - promptTime;
  let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
  if (differenceInDays > 14) {
    return true;
  } else {
    return false;
  }
};

export const calculateTimeDiff = (expiration) => {
  if (!expiration) {
    const minutes = null;
    const seconds = null;
    return { minutes, seconds };
  }
  const expirationTime = new Date(expiration).getTime();
  const currentTime = new Date().getTime();
  const remainingTime = Math.max(0, expirationTime - currentTime);

  const minutes = Math.floor(remainingTime / 1000 / 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  return { minutes, seconds };
};

export const isNumber = (value) => {
  return /^\d+$/.test(value);
};

export const dataFormatter = (date) => {
  const originalDate = new Date(date);
  const formattedDate = originalDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formattedDate;
};

export const getFrequency = (str) => {
  if (str.includes('Per Month')) {
    return '/month';
  }
  if (str.includes('Per Week')) {
    return '/week';
  }
  return null;
};

export const getServiceHours = (freq, serviceHours) => {
  const frequency = getFrequency(freq);
  if (frequency === '/week') {
    return serviceHours * 7 * 24;
  } else if (frequency === '/month') {
    return serviceHours * 30 * 24;
  } else {
    return serviceHours;
  }
};
