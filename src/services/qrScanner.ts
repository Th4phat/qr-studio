import QrScanner from 'qr-scanner';
import type { QRScanResult } from '../types';

export class QRScannerService {
  private scanner: QrScanner | null = null;

  async scanFromFile(file: File): Promise<QRScanResult> {
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true
      });

      return {
        data: result.data,
        rawText: result.data,
        file: file.name,
        format: 'qr_code',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to scan file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async scanFromBlob(blob: Blob): Promise<QRScanResult> {
    try {
      const result = await QrScanner.scanImage(blob, {
        returnDetailedScanResult: true
      });

      return {
        data: result.data,
        rawText: result.data,
        format: 'qr_code',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to scan image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async scanFromImageData(imageData: ImageData): Promise<QRScanResult> {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      ctx.putImageData(imageData, 0, 0);

      const result = await QrScanner.scanImage(canvas, {
        returnDetailedScanResult: true
      });

      return {
        data: result.data,
        rawText: result.data,
        format: 'qr_code',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to scan image data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startCamera(
    videoElement: HTMLVideoElement,
    onScan: (result: QRScanResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      this.scanner = new QrScanner(
        videoElement,
        (result) => {
          onScan({
            data: result.data,
            rawText: result.data,
            format: 'qr_code',
            timestamp: Date.now()
          });
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true
        }
      );

      await this.scanner.start();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (onError) {
        onError(new Error(`Failed to start camera: ${errorMessage}`));
      }
      throw new Error(`Failed to start camera: ${errorMessage}`);
    }
  }

  async stopCamera(): Promise<void> {
    if (this.scanner) {
      this.scanner.stop();
      this.scanner = null;
    }
  }

  async hasCamera(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  async getCameras(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch {
      return [];
    }
  }

  setCamera(cameraId: string): void {
    if (this.scanner) {
      this.scanner.setCamera(cameraId);
    }
  }

  toggleFlash(): void {
    if (this.scanner) {
      this.scanner.toggleFlash();
    }
  }

  isFlashOn(): boolean {
    return this.scanner?.isFlashOn() ?? false;
  }

  destroy(): void {
    if (this.scanner) {
      this.scanner.destroy();
      this.scanner = null;
    }
  }

  async scanFromCanvas(canvas: HTMLCanvasElement): Promise<QRScanResult> {
    try {
      const result = await QrScanner.scanImage(canvas, {
        returnDetailedScanResult: true
      });

      return {
        data: result.data,
        rawText: result.data,
        format: 'qr_code',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to scan canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processImageForScan(file: File): Promise<{ canvas: HTMLCanvasElement; imageData: ImageData }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        const maxSize = 1024;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        resolve({ canvas, imageData });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  validateScanResult(data: string): { isValid: boolean; type: string; sanitized: string } {
    const trimmed = data.trim();
    
    if (!trimmed) {
      return { isValid: false, type: 'empty', sanitized: '' };
    }

    try {
      const url = new URL(trimmed);
      if (['http:', 'https:'].includes(url.protocol)) {
        return { isValid: true, type: 'url', sanitized: url.toString() };
      }
    } catch {
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { isValid: true, type: 'email', sanitized: trimmed };
    }

    if (/^[\+]?[1-9][\d]{0,15}$/.test(trimmed.replace(/[\s\-\(\)]/g, ''))) {
      return { isValid: true, type: 'phone', sanitized: trimmed };
    }

    if (trimmed.startsWith('WIFI:')) {
      return { isValid: true, type: 'wifi', sanitized: trimmed };
    }

    if (trimmed.startsWith('BEGIN:VCARD') && trimmed.endsWith('END:VCARD')) {
      return { isValid: true, type: 'vcard', sanitized: trimmed };
    }

    return { isValid: true, type: 'text', sanitized: trimmed };
  }
}

export const qrScanner = new QRScannerService();