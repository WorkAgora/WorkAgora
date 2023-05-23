export const useColoredBadges = () => {
  const badgeColors: { [key: string]: string } = {
    yellow: 'badge.yellow',
    purple: 'badge.purple',
    red: 'badge.red',
    blue: 'badge.blue',
    green: 'badge.green',
    orange: 'badge.orange',
    teal: 'badge.teal',
    pink: 'badge.pink',
    indigo: 'badge.indigo'
  };

  // Mapping between color names and hex values to decide text color.
  const colorHexValues: { [key: string]: string } = {
    yellow: '#FDB81E',
    purple: '#9E38C0',
    red: '#E53E3E',
    blue: '#3182CE',
    green: '#38A169',
    orange: '#DD6B20',
    teal: '#319795',
    pink: '#D53F8C',
    indigo: '#667EEA'
  };

  const skills = [
    'JavaScript',
    'TypeScript',
    'Angular',
    'Node.js',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'C#',
    '.NET',
    'SQL Server',
    'Python',
    'Django',
    'Ruby',
    'Ruby on Rails',
    'Kubernetes',
    'Terraform',
    'Docker',
    'C++',
    'Embedded Systems',
    'Real-time Software',
    'Cybersecurity',
    'Threat Intelligence',
    'Incident Response',
    'R',
    'Machine Learning',
    'Data Visualization',
    'React Native'
  ];

  const skillBadges = skills.reduce<{
    [skill: string]: { bgColor: string; color: string };
  }>((acc, skill, index) => {
    const colorKeys = Object.keys(badgeColors);
    const color = colorKeys[index % colorKeys.length]; // Deterministic selection of color

    // Decide the text color based on the background color brightness
    const hex = colorHexValues[color];
    const brightness = parseInt(hex.slice(1), 16);
    const textColor = brightness > 0xffffff / 2 ? 'neutral.black' : 'neutral.white';

    // Add to the accumulator
    acc[skill] = { bgColor: badgeColors[color], color: textColor };
    return acc;
  }, {});

  return skillBadges;
};
