import { skills } from '@workagora/utils';

export const useColoredBadges = () => {
  const badgeColors: { [key: string]: string } = {
    Development: 'badge.blue',
    Design: 'badge.green',
    'Writing & Content': 'badge.red',
    'Marketing & Sales': 'badge.yellow',
    'Business & Management': 'badge.purple',
    'IT & Networking': 'badge.orange',
    'Multimedia & Animation': 'badge.teal',
    'Legal Services': 'badge.pink',
    'Customer Service': 'badge.indigo',
    'Learning & Education': 'badge.cyan',
    'Engineering & Architecture': 'badge.lime',
    'Translation & Languages': 'badge.amber'
  };

  // Mapping between color names and hex values to decide text color.
  const colorHexValues: { [key: string]: string } = {
    blue: '#3182CE',
    green: '#38A169',
    red: '#E53E3E',
    yellow: '#FDB81E',
    purple: '#9E38C0',
    orange: '#DD6B20',
    teal: '#319795',
    pink: '#D53F8C',
    indigo: '#667EEA',
    cyan: '#48BB78',
    lime: '#84CC16',
    amber: '#F6AD55'
  };

  const skillBadges = skills.reduce<{
    [skill: string]: { bgColor: string; color: string };
  }>((acc, skill) => {
    const color = badgeColors[skill.category];

    const hex = colorHexValues[color.replace('badge.', '')];
    const brightness = parseInt(hex.slice(1), 16);
    const textColor = brightness > 0xffffff / 2 ? 'neutral.black' : 'neutral.white';

    // Add to the accumulator
    acc[skill.category] = { bgColor: badgeColors[skill.category], color: textColor };
    return acc;
  }, {});

  const getCategoryColorForSkill = (skill: string) => {
    const topCat = skills.find((v) => v.list.includes(skill));
    if (topCat) {
      return skillBadges[topCat.category];
    }
    return { bgColor: 'neutral.white', color: 'neutral.black' };
  };

  const allSkills = skills.reduce(
    (acc: string[], category: { category: string; list: string[] }) => {
      return [...acc, ...category.list];
    },
    []
  );

  return { getCategoryColorForSkill, allSkills };
};
