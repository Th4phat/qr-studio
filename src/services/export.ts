import type { ExportFormat } from '../types';

export class ExportService {
  async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async downloadSVG(svgContent: string, filename: string): Promise<void> {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    await this.downloadFile(blob, filename);
  }

  async downloadPNG(pngBlob: Blob, filename: string): Promise<void> {
    await this.downloadFile(pngBlob, filename);
  }

  async downloadJSON(data: any, filename: string): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    await this.downloadFile(blob, filename);
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  }

  async copyImageToClipboard(blob: Blob): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to copy image to clipboard:', error);
      return false;
    }
  }

  generateFilename(base: string, format: ExportFormat, timestamp?: number): string {
    const time = timestamp || Date.now();
    return `${base}-${time}.${format}`;
  }

  async shareData(data: string, title?: string): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'QR Code Data',
          text: data
        });
        return true;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
        return false;
      }
    }
    return false;
  }

  async shareFile(blob: Blob, filename: string, title?: string): Promise<boolean> {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type });
      
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: title || 'QR Code',
            files: [file]
          });
          return true;
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Error sharing file:', error);
          }
          return false;
        }
      }
    }
    return false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async getBlobFromDataURL(dataURL: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Failed to convert data URL to blob: ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error while converting data URL to blob'));
      xhr.open('GET', dataURL);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  async createCanvasFromImage(imageSource: string | HTMLImageElement | HTMLCanvasElement): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof HTMLImageElement) {
        img.src = imageSource.src;
      } else if (imageSource instanceof HTMLCanvasElement) {
        canvas.width = imageSource.width;
        canvas.height = imageSource.height;
        ctx.drawImage(imageSource, 0, 0);
        resolve(canvas);
      }
    });
  }

  async resizeImage(blob: Blob, maxWidth: number, maxHeight: number, quality: number = 0.9): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = URL.createObjectURL(blob);
    });
  }
}

export const exportService = new ExportService();