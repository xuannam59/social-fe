export interface IEmojiItem {
  id: string;
  emoji: string;
  label: string;
  slug: string;
}

export interface IEmojiReaction {
  id: string;
  emoji: string;
  label: string;
  value: number;
  color: string;
}
