const formattingRules = [
  [/\*\*([\s\S]+?)\*\*/g, '$1'], //bold
  [/\*([\s\S]+?)\*/g, '$1'], //italic
  [/^#{1,6}\s+/gm, ''], // heading
  [/^(?:[-*]|\d+\.)\s+/gm, ''], // lists
];

export const cleanupFormatting = (
  text,
  rules = formattingRules,
  mode = 'editor',
) => {
  if (!text) return '';

  let textToClean = text;

  for (let [pattern, replacement] of rules) {
    textToClean = textToClean.replace(pattern, replacement);
  }

  {
    /* normalize whitespace (issue with '.' being present and counted */
  }

  textToClean = textToClean.replace(/[\t\u00A0]/g, ' ');

  {
    /*preserve white spaces for char count in preview */
  }

  if (mode !== 'editor') {
    return textToClean;
  }

  return textToClean
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .join('\n');
};

export const splitAndFormatText = (text, wrapper) => {
  if (!text) return '';

  const cleaned = cleanupFormatting(text, undefined, 'preview');
  const wrapped = cleaned
    .split('\n')
    .map(line => (line.trim() === '' ? '' : wrapper(line)));

  return wrapped.join('\n');
};

export const bold = text => {
  return splitAndFormatText(text, line => `**${line}**`);
};

export const italic = text => {
  return splitAndFormatText(text, line => `*${line}*`);
};

export const heading = text => {
  return splitAndFormatText(text, line => `# ${line}`);
};

export const list = text => {
  return splitAndFormatText(text, line => `- ${line}`);
};

export const detectActiveTools = text => {
  const tools = [];
  const trimmed = text.trim();

  if (/\*\*(.+?)\*\*/.test(trimmed)) {
    tools.push('bold');
  } else if (/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/.test(trimmed)) {
    tools.push('italic');
  }

  if (/^#{1,6}(.+)/m.test(trimmed)) {
    tools.push('heading');
  }

  const lines = trimmed.split('\n').filter(line => line.trim() !== '');

  if (lines.length > 0 && lines.some(line => line.trim().startsWith('- '))) {
    tools.push('list');
  }

  return tools;
};
