import QRCode from 'qrcode';
import type { QRConfig } from '../types';

export class QRGeneratorService {
  private defaultConfig: Partial<QRConfig> = {
    version: 'auto',
    errorCorrection: 'M',
    size: 300,
    margin: 4,
    colorDark: '#000000',
    colorLight: '#FFFFFF',
    roundedModules: false,
    eyeStyle: 'square'
  };

  async generate(config: QRConfig): Promise<{ svg: string; pngBlob: Blob }> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!finalConfig.data || finalConfig.data.trim() === '') {
      throw new Error('QR code data cannot be empty');
    }

    try {
      const svg = await QRCode.toString(finalConfig.data, {
        type: 'svg',
        version: finalConfig.version === 'auto' ? undefined : finalConfig.version,
        errorCorrectionLevel: finalConfig.errorCorrection,
        margin: finalConfig.margin,
        color: {
          dark: finalConfig.colorDark!,
          light: finalConfig.colorLight!
        }
      });

      const pngDataUrl = await QRCode.toDataURL(finalConfig.data, {
        version: finalConfig.version === 'auto' ? undefined : finalConfig.version,
        errorCorrectionLevel: finalConfig.errorCorrection,
        width: finalConfig.size,
        margin: finalConfig.margin,
        color: {
          dark: finalConfig.colorDark!,
          light: finalConfig.colorLight!
        }
      });

      const pngBlob = await this.dataUrlToBlob(pngDataUrl);

      return { svg, pngBlob };
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateSVG(config: QRConfig): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!finalConfig.data || finalConfig.data.trim() === '') {
      throw new Error('QR code data cannot be empty');
    }

    try {
      return await QRCode.toString(finalConfig.data, {
        type: 'svg',
        version: finalConfig.version === 'auto' ? undefined : finalConfig.version,
        errorCorrectionLevel: finalConfig.errorCorrection,
        margin: finalConfig.margin,
        color: {
          dark: finalConfig.colorDark!,
          light: finalConfig.colorLight!
        }
      });
    } catch (error) {
      throw new Error(`Failed to generate SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePNG(config: QRConfig): Promise<Blob> {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (!finalConfig.data || finalConfig.data.trim() === '') {
      throw new Error('QR code data cannot be empty');
    }

    try {
      const dataUrl = await QRCode.toDataURL(finalConfig.data, {
        version: finalConfig.version === 'auto' ? undefined : finalConfig.version,
        errorCorrectionLevel: finalConfig.errorCorrection,
        width: finalConfig.size,
        margin: finalConfig.margin,
        color: {
          dark: finalConfig.colorDark!,
          light: finalConfig.colorLight!
        }
      });

      return await this.dataUrlToBlob(dataUrl);
    } catch (error) {
      throw new Error(`Failed to generate PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
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
      xhr.open('GET', dataUrl);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  validateConfig(config: Partial<QRConfig>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.data !== undefined && (typeof config.data !== 'string' || config.data.trim() === '')) {
      errors.push('Data must be a non-empty string');
    }

    if (config.version !== undefined && config.version !== 'auto' && (typeof config.version !== 'number' || config.version < 1 || config.version > 40)) {
      errors.push('Version must be "auto" or a number between 1 and 40');
    }

    if (config.errorCorrection !== undefined && !['L', 'M', 'Q', 'H'].includes(config.errorCorrection)) {
      errors.push('Error correction must be one of: L, M, Q, H');
    }

    if (config.size !== undefined && (typeof config.size !== 'number' || config.size < 50 || config.size > 2000)) {
      errors.push('Size must be a number between 50 and 2000');
    }

    if (config.margin !== undefined && (typeof config.margin !== 'number' || config.margin < 0 || config.margin > 20)) {
      errors.push('Margin must be a number between 0 and 20');
    }

    if (config.colorDark !== undefined && !this.isValidColor(config.colorDark)) {
      errors.push('Color dark must be a valid color');
    }

    if (config.colorLight !== undefined && !this.isValidColor(config.colorLight)) {
      errors.push('Color light must be a valid color');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidColor(color: string): boolean {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  }

  getPresets() {
    return {
      url: {
        data: 'https://example.com',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      },
      text: {
        data: 'Hello, World!',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      },
      wifi: {
        data: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      },
      vcard: {
        data: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD',
        errorCorrection: 'M' as const,
        version: 'auto' as const
      }
    };
  }
}

export const qrGenerator = new QRGeneratorService();