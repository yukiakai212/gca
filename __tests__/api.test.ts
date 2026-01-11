import { describe, it, expect } from 'vitest';
import { Logger, LogLevel } from '../src/index.js';

describe('Logger.shouldLog', () => {
  it('should log correctly based on levels', () => {
    const table: [Logger['level'], Logger['level'], boolean][] = [
      ['debug', 'debug', true],
      ['debug', 'info', true],
      ['debug', 'warn', true],
      ['debug', 'error', true],
      ['debug', 'fatal', true],

      ['info', 'debug', false],
      ['info', 'info', true],
      ['info', 'warn', true],
      ['info', 'error', true],
      ['info', 'fatal', true],

      ['warn', 'debug', false],
      ['warn', 'info', false],
      ['warn', 'warn', true],
      ['warn', 'error', true],
      ['warn', 'fatal', true],

      ['error', 'debug', false],
      ['error', 'info', false],
      ['error', 'warn', false],
      ['error', 'error', true],
      ['error', 'fatal', true],

      ['fatal', 'debug', false],
      ['fatal', 'info', false],
      ['fatal', 'warn', false],
      ['fatal', 'error', false],
      ['fatal', 'fatal', true],

      ['silent', 'debug', false],
      ['silent', 'info', false],
      ['silent', 'warn', false],
      ['silent', 'error', false],
      ['silent', 'fatal', false],
    ];

    for (const [loggerLevel, targetLevel, expected] of table) {
      Logger.level = loggerLevel;
      expect(Logger.shouldLogTest(targetLevel)).toBe(expected);
    }
  });
});
