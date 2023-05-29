export const getDateDiff = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years, months;

  months = end.getMonth() - start.getMonth();
  years = end.getFullYear() - start.getFullYear();

  if (months < 0) {
    years--;
    months += 12;
  }

  let text = '';
  if (years) {
    if (years > 1) {
      text += `${years} years`;
    }
    if (years === 1) {
      text += `${years} year`;
    }
  }
  if (text !== '') text += ' & ';
  if (months) {
    if (months > 1) {
      text += `${months} months`;
    }
    if (months === 1) {
      text += `${months} month`;
    }
  }
  return text;
};

export const getDateDiffWithDaysAndHours = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years, months, days, hours, minutes;

  months = end.getMonth() - start.getMonth();
  years = end.getFullYear() - start.getFullYear();
  days = end.getDate() - start.getDate();
  hours = end.getHours() - start.getHours();
  minutes = end.getMinutes() - start.getMinutes();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0 || (days === 0 && hours < 0)) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  if (hours < 0) {
    days--;
    hours += 24;
  }

  if (minutes < 0) {
    hours--;
    minutes += 60;
  }

  let text = '';
  if (years) {
    text += years > 1 ? `${years} years` : `${years} year`;
  }
  if (months) {
    text += text ? ' & ' : '';
    text += months > 1 ? `${months} months` : `${months} month`;
  }
  if (text === '') {
    if (days) {
      text += text ? ' & ' : '';
      text += days > 1 ? `${days} days` : `${days} day`;
    }
  }
  if (text === '') {
    if (hours) {
      text += text ? ' & ' : '';
      text += hours > 1 ? `${hours} hours` : `${hours} hour`;
    }
    if (minutes) {
      text += text ? ' & ' : '';
      text += minutes > 1 ? `${minutes} minutes` : `${minutes} minute`;
    }
  }
  return text;
};
