import formatDuration from './formatDuration';

describe('formatDuration', () => {
  it('Show seconds rounded', () => {
    expect(formatDuration(1000)).toEqual('0:01');
    expect(formatDuration(1400)).toEqual('0:01');
    expect(formatDuration(1500)).toEqual('0:02');
    expect(formatDuration(30000)).toEqual('0:30');
  });

  it('Show minutes rounded', () => {
    expect(formatDuration(60000)).toEqual('1:00');
    expect(formatDuration(61000)).toEqual('1:01');
    expect(formatDuration(2700000)).toEqual('45:00');
  });

  it('Show hours rounded', () => {
    expect(formatDuration(3600000)).toEqual('1:00:00');
    expect(formatDuration(6300000)).toEqual('1:45:00');
    expect(formatDuration(9000000)).toEqual('2:30:00');
  });
});
