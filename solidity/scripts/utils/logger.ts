import chalk from 'chalk';

const TitleLog = (title: string): string => {
  const terminalWidth = process.stdout.columns;
  const hyphenSize = (terminalWidth - title.length) / 6;
  const hyphenStringRight = '-'.repeat(hyphenSize);
  const hyphenStringLeft = '-'.repeat(hyphenSize - 2);
  return chalk.yellow(`${hyphenStringLeft} ${title} ${hyphenStringRight}`);
};

const KeyValueLog = (key: string, value: string): string => {
  return `    ${chalk.yellow(`● ${key} →`)} ${value}`;
};

export { TitleLog, KeyValueLog };
