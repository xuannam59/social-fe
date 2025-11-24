import ColorThief from 'colorthief';

export const getDominantColor = (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const dominantColor = colorThief.getColor(img);

          const [r, g, b] = dominantColor;
          const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

          resolve(hexColor);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Không thể tải ảnh'));
      };

      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

export const getImageInfo = (
  imageFile: File
): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
}> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: imageFile.size,
          type: imageFile.type,
        });
      };

      img.onerror = () => {
        reject(new Error('Không thể tải ảnh'));
      };

      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

export const getColorPalette = (
  imageFile: File,
  colorCount: number = 5
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();

      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(img, colorCount);

          // Chuyển đổi từ RGB sang hex
          const hexColors = palette.map(
            ([r, g, b]) =>
              `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          );

          resolve(hexColors);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Không thể tải ảnh'));
      };

      img.src = URL.createObjectURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

export const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const base64ToFile = (base64: string, fileName: string): File => {
  // Tách phần data và mime type từ base64 string
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Tạo File object từ Uint8Array
  return new File([u8arr], fileName, { type: mime });
};

export const saveStory = async (
  width: number,
  height: number,
  dominantColor: string
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Tăng pixel ratio để có chất lượng cao
  const pixelRatio = Math.max(3, window.devicePixelRatio || 1);
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  // Cải thiện chất lượng canvas
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.scale(pixelRatio, pixelRatio);

  ctx.fillStyle = dominantColor;
  ctx.fillRect(0, 0, width, height);
  let file: File;
  const stageImage = new window.Image();
  return new Promise(resolve => {
    stageImage.onload = () => {
      // Cải thiện chất lượng khi vẽ image
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(stageImage, 0, 0, width, height);

      ctx.restore();

      let base64: string;
      let fileName: string;

      try {
        // Thử export WebP
        base64 = canvas.toDataURL('image/webp', 0.95);
        fileName = `story-${Date.now()}.webp`;
      } catch (error) {
        // Nếu WebP không được hỗ trợ, fallback về PNG
        console.warn('WebP không được hỗ trợ, sử dụng PNG');
        base64 = canvas.toDataURL('image/png', 1.0);
        fileName = `story-${Date.now()}.png`;
      }
      file = base64ToFile(base64, fileName);
      resolve(file);
    };
  });
};
