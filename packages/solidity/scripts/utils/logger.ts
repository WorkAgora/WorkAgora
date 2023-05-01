import chalk from 'chalk';

class Logger {
  logInfo(...args: unknown[]) {
    console.log(...args);
  }

  logWarn(...args: unknown[]) {
    console.warn(...args);
  }

  logError(...args: unknown[]) {
    console.error(...args);
  }

  logInfoTitle(title: string, ...args: [string, string][]) {
    this.logInfo(`${Logger.titleLog(title)}\n`
      + `${args.map(([key, value]) => Logger.keyValueLog(key, value)).join('\n')}`)
  }

  private static titleLog(title: string): string {
    const terminalWidth = process.stdout.columns;
    const hyphenSize = (terminalWidth - title.length) / 6;
    const hyphenStringRight = '-'.repeat(hyphenSize);
    const hyphenStringLeft = '-'.repeat(hyphenSize - 2);
    return chalk.yellow(`${hyphenStringLeft} ${title} ${hyphenStringRight}`);
  }

  private static keyValueLog(key: string, value: string): string {
    return `    ${chalk.yellow(`● ${key} →`)} ${value}`;
  }
}

export const logger = new Logger();
