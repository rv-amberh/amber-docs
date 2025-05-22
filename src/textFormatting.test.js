/* eslint-env jest */
import {
  cleanupFormatting,
  detectActiveTools,
} from '../src/utils/textFormatting';
{
  /*test utils*/
}

describe('cleanupFormatting', () => {
  it('strips **bold** markers', () => {
    const input = 'This is **bold** text';
    expect(cleanupFormatting(input)).toBe('This is bold text');
  });

  it('strips list markers', () => {
    const input = '- Item one\n* Item two\n1. Third';
    // cleanupFormatting applies each replace rule in sequence
    expect(cleanupFormatting(input)).toBe('Item one\nItem two\nThird');
  });
});

describe('detectActiveTools', () => {
  it('detects bold and italic correctly', () => {
    expect(detectActiveTools('**bold**')).toEqual(['bold']);
    expect(detectActiveTools('*italic*')).toEqual(['italic']);
  });

  it('detects headings and lists', () => {
    expect(detectActiveTools('# Heading')).toEqual(['heading']);
    expect(detectActiveTools('- list item')).toEqual(['list']);
  });
});
