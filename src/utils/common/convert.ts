import type { IFile } from '@social/types/post.type';

export const convertToSlug = (str: string): string => {
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

export const convertToFile = (files: FileList | null): IFile[] => {
  if (files && files.length > 0) {
    const fileUrls = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      type: file.type,
    }));
    return fileUrls;
  }
  return [];
};
