import type { IMedia } from '@social/types/posts.type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
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

export const formatFile = (files: FileList | null): IMedia[] => {
  if (files && files.length > 0) {
    const fileUrls = Array.from(files).map(file => ({
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
    return formatFullDateTime(date, false);
  }
};

export const formatFullDateTime = (date: string, isShowDay = true) => {
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
  const result = `${day} Tháng ${month}, ${year} lúc ${hour}:${minute}`;
  if (isShowDay) {
    return `${dayText}, ${result}`;
  }
  return result;
};

export const converToNumber = (value: string) => {
  return value.replace(/,/g, '');
};

export const formatNumberAbbreviate = (count: number): string => {
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
    compactDisplay: 'short',
  }).format(count);

  return formatter.replace('.', ',');
};
