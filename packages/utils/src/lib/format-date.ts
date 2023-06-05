export const formatDate = (date: Date) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  let day: string | number = date.getDate();
  const monthIndex: number = date.getMonth();
  const year: number = date.getFullYear();

  let hour: string | number = date.getHours();
  let minute: string | number = date.getMinutes();

  // Padding with '0' to get two digits
  day = day < 10 ? '0' + day : day;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;

  return day + ' ' + months[monthIndex] + '. ' + year + ' at ' + hour + ':' + minute;
};

export const formatDateMessage = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });

  if (date > today) {
    return `Today, ${time}`;
  } else if (date > yesterday) {
    return `Yesterday, ${time}`;
  } else {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const datePart = date.toLocaleDateString('en-US', options);
    return `${datePart}, ${time}`;
  }
};
