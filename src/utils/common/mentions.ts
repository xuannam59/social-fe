export const calculateFormPosition = (
  textareaPos: number,
  formValue: string
): number => {
  let formPos = 0;
  let textareaPos_current = 0;

  // Regex để tìm mentions: @[Tên](id)
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let lastIndex = 0;

  while (
    (match = mentionRegex.exec(formValue)) !== null &&
    textareaPos_current < textareaPos
  ) {
    const mentionStart = match.index;
    const mentionEnd = match.index + match[0].length;
    const displayText = `${match[1]}`;

    const beforeMention = formValue.slice(lastIndex, mentionStart);
    if (textareaPos_current + beforeMention.length >= textareaPos) {
      formPos += textareaPos - textareaPos_current;
      return formPos;
    }

    textareaPos_current += beforeMention.length;
    formPos += beforeMention.length;

    if (textareaPos_current + displayText.length >= textareaPos) {
      formPos += match[0].length;
      return formPos;
    }

    textareaPos_current += displayText.length;
    formPos += match[0].length;
    lastIndex = mentionEnd;
  }

  const remaining = textareaPos - textareaPos_current;
  formPos += remaining;

  return formPos;
};

export const calculateTextareaPosition = (
  formPos: number,
  formValue: string
): number => {
  let textareaPos = 0;
  let formPos_current = 0;

  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  let lastIndex = 0;

  while (
    (match = mentionRegex.exec(formValue)) !== null &&
    formPos_current < formPos
  ) {
    const mentionStart = match.index;
    const mentionEnd = match.index + match[0].length;
    const displayText = `@${match[1]}`;

    const beforeMention = formValue.slice(lastIndex, mentionStart);
    if (formPos_current + beforeMention.length >= formPos) {
      textareaPos += formPos - formPos_current;
      return textareaPos;
    }

    textareaPos += beforeMention.length;
    formPos_current += beforeMention.length;

    if (formPos_current + match[0].length >= formPos) {
      textareaPos += displayText.length;
      return textareaPos;
    }

    textareaPos += displayText.length;
    formPos_current += match[0].length;
    lastIndex = mentionEnd;
  }

  const remaining = formPos - formPos_current;
  textareaPos += remaining;

  return textareaPos;
};
