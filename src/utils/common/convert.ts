import type { IPreviewMedia } from '@social/types/posts.type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import { v4 as uuidv4 } from 'uuid';
dayjs.extend(relativeTime);
dayjs.extend(calendar);

export const formatSlug = (str: string): string => {
  if (!str) return '';

  return str
    .normalize('NFD')
    .toLocaleLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/ /g, '-')
    .replace(/[:!@#$%^&*()?;/]/g, '');
};

export const formatFile = (files: FileList | null): IPreviewMedia[] => {
  if (files && files.length > 0) {
    const fileUrls: IPreviewMedia[] = Array.from(files).map(file => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file,
      type: file.type.split('/')[0],
    }));
    return fileUrls;
  }
  return [];
};

export const formatRelativeTime = (date: string) => {
  const dateTime = dayjs(date);
  const diffInSeconds = dayjs().diff(dateTime, 'second');
  const diffInMinutes = dayjs().diff(dateTime, 'minute');
  const diffInHours = dayjs().diff(dateTime, 'hour');

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ`;
  } else if (diffInHours < 48) {
    return 'Hôm qua';
  } else {
    return formatFullDateTime(date, false, false);
  }
};

export const formatRelativeTimeV2 = (date: string) => {
  const dateTime = dayjs(date);
  const diffInSeconds = dayjs().diff(dateTime, 'second');
  const diffInMinutes = dayjs().diff(dateTime, 'minute');
  const diffInHours = dayjs().diff(dateTime, 'hour');
  const diffInDays = dayjs().diff(dateTime, 'day');
  const diffInMonths = dayjs().diff(dateTime, 'month');

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} giờ`;
  }
  if (diffInMonths > 3) {
    return '';
  }
  if (diffInMonths >= 1) {
    return `${diffInMonths} tháng`;
  }
  if (diffInDays > 1) {
    return `${diffInDays} ngày`;
  }
  // Trường hợp đúng 1 ngày
  if (diffInDays === 1) {
    return '1 ngày';
  }
  return '';
};

export const formatFullDateTime = (
  date: string,
  showDayOfWeek = true,
  showYear = true
) => {
  const day = dayjs(date).day();
  const month = dayjs(date).month() + 1;
  const year = dayjs(date).year();
  const hour = dayjs(date).hour();
  const minute = dayjs(date).minute();
  let dayText = '';
  switch (day) {
    case 0:
      dayText = 'Chủ Nhật';
      break;
    case 1:
      dayText = 'Thứ Hai';
      break;
    case 2:
      dayText = 'Thứ Ba';
      break;
    case 3:
      dayText = 'Thứ Tư';
      break;
    case 4:
      dayText = 'Thứ Năm';
      break;
    case 5:
      dayText = 'Thứ Sáu';
      break;
    case 6:
      dayText = 'Thứ Bảy';
      break;
  }
  return `${showDayOfWeek ? `${dayText}, ` : ''} ${day} Tháng ${month}${showYear ? `, ${year}` : ''} lúc ${hour}:${minute}`;
};

export const formatNumberAbbreviate = (count: number): string => {
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
    compactDisplay: 'short',
  }).format(count);

  return formatter.replace('.', ',');
};

export const convertUrlString = (key: string) => {
  const region = import.meta.env.VITE_AWS_REGION;
  const bucket = import.meta.env.VITE_S3_BUCKET_KEY;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const convertErrorMessage = (message: string | string[]) => {
  return message && Array.isArray(message)
    ? JSON.stringify(message.join(', '))
    : message;
};

export const convertMentions = (content: string) => {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      userId: match[2],
      position: {
        start: match.index,
        end: match.index + match[0].length,
      },
    });
  }

  return mentions;
};
