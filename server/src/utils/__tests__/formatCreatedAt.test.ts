import formatCreatedAt from '../timeConverter';

describe('formatCreatedAt', () => {
  it('should format a date string correctly with "st" suffix', () => {
    const result = formatCreatedAt('2023-04-01T13:22:43.115Z');
    expect(result).toBe('April 1st, 2023 1:22 PM');
  });

  it('should format a date string correctly with "nd" suffix', () => {
    const result = formatCreatedAt('2023-04-02T13:22:43.115Z');
    expect(result).toBe('April 2nd, 2023 1:22 PM');
  });

  it('should format a date string correctly with "rd" suffix', () => {
    const result = formatCreatedAt('2023-04-03T13:22:43.115Z');
    expect(result).toBe('April 3rd, 2023 1:22 PM');
  });

  it('should format a date string correctly with "th" suffix', () => {
    const result = formatCreatedAt('2023-04-04T13:22:43.115Z');
    expect(result).toBe('April 4th, 2023 1:22 PM');
  });

  it('should format a date string correctly with a double-digit day', () => {
    const result = formatCreatedAt('2023-04-11T13:22:43.115Z');
    expect(result).toBe('April 11th, 2023 1:22 PM');
  });

  it('should handle different times correctly', () => {
    const result = formatCreatedAt('2023-04-18T00:22:43.115Z');
    expect(result).toBe('April 18th, 2023 12:22 AM');
  });

  it('should format a date string correctly with "nd" suffix for 22nd', () => {
    const result = formatCreatedAt('2023-04-22T13:22:43.115Z');
    expect(result).toBe('April 22nd, 2023 1:22 PM');
  });

  it('should format a date string correctly with "rd" suffix for 23rd', () => {
    const result = formatCreatedAt('2023-04-23T13:22:43.115Z');
    expect(result).toBe('April 23rd, 2023 1:22 PM');
  });

  it('should format a date string correctly with "th" suffix for 13th', () => {
    const result = formatCreatedAt('2023-04-13T13:22:43.115Z');
    expect(result).toBe('April 13th, 2023 1:22 PM');
  });
});
