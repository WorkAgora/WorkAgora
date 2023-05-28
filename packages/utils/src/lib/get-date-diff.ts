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
