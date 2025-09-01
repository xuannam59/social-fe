import React from 'react';
import type { IComment } from '@social/types/comments.type';

export const renderComment = (
  comment: string,
  mentions: IComment['mentions']
) => {
  if (!mentions || mentions.length === 0) {
    return comment;
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  mentions.forEach(mention => {
    if (mention.position.start > lastIndex) {
      const textBefore = comment.slice(lastIndex, mention.position.start);
      if (textBefore) {
        result.push(textBefore);
      }
    }

    const fullMentionText = comment.slice(
      mention.position.start,
      mention.position.end
    );

    const userName = fullMentionText.includes('@[')
      ? fullMentionText.match(/@\[([^\]]+)\]/)?.[1] || 'User'
      : 'User';

    result.push(
      React.createElement(
        'span',
        {
          key: mention._id,
          className:
            'inline-block bg-mention font-medium px-1 rounded cursor-pointer hover:bg-blue-200 transition-colors',
          onClick: () => console.log('Navigate to user:', mention.userId),
        },
        `${userName}`
      )
    );

    lastIndex = mention.position.end;
  });

  if (lastIndex < comment.length) {
    const remainingText = comment.slice(lastIndex);
    if (remainingText) {
      result.push(remainingText);
    }
  }

  return result;
};
