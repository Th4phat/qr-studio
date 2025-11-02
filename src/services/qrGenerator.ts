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
    console.log('Generating QR with config:', finalConfig);
    if (!finalConfig.data || finalConfig.data.trim() === '') {
      throw new Error('QR code data cannot be empty');
    }

    try {
      const svg = await this.generateSVG(finalConfig);
      console.log('Generated SVG string:', svg);
      const pngBlob = await this.generatePNG(finalConfig);

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
      let svg = await QRCode.toString(finalConfig.data, {
        type: 'svg',
        version: finalConfig.version === 'auto' ? undefined : finalConfig.version,
        errorCorrectionLevel: finalConfig.errorCorrection,
        margin: finalConfig.margin,
        color: {
          dark: finalConfig.colorDark!,
          light: finalConfig.colorLight!
        }
      });

      if (finalConfig.logo?.src) {
        svg = this.embedLogoInSVG(svg, finalConfig.logo, finalConfig.size || 300);
      }

      return svg;
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
      const svg = await this.generateSVG(finalConfig);
      
      return await this.svgToPng(svg, finalConfig.size || 300);
    } catch (error) {
      throw new Error(`Failed to generate PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private embedLogoInSVG(
  svg: string,
  logo: NonNullable<QRConfig['logo']>,
  finalPixelSize: number
): string {
  const logoPxSize = logo.size || 40;
  const logoPxPadding = 2;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (!svgElement) return svg;

  const viewBox = svgElement.getAttribute('viewBox');
  if (!viewBox) {
    return svg;
  }

  const viewBoxParts = viewBox.split(' ').map(Number);
  const svgInternalWidth = viewBoxParts[2];
  const svgInternalHeight = viewBoxParts[3];

  const scale = svgInternalWidth / finalPixelSize;

  const logoSize = logoPxSize * scale;
  const padding = logoPxPadding * scale;

  const logoCenterX = svgInternalWidth / 2;
  const logoCenterY = svgInternalHeight / 2;

  const bgRadius = (logoSize / 2) + padding;
  
  const whiteBackground = `
    <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${bgRadius}" fill="white"/>
  `;

  const clipPathId = `logoClip-${Math.random().toString(36).substring(2, 9)}`;
  const clipPath = `
    <defs>
      <clipPath id="${clipPathId}">
        <circle cx="${logoCenterX}" cy="${logoCenterY}" r="${logoSize / 2}"/>
      </clipPath>
    </defs>
  `;

  const logoImage = `
    <image x="${logoCenterX - logoSize / 2}" y="${logoCenterY - logoSize / 2}" 
           width="${logoSize}" height="${logoSize}"
           href="${logo.src}" preserveAspectRatio="xMidYMid meet"
           clip-path="url(#${clipPathId})"/>
  `;

  const svgCloseIndex = svg.lastIndexOf('</svg>');
  if (svgCloseIndex === -1) return svg;

  const logoElements = clipPath + whiteBackground + logoImage;
  return svg.substring(0, svgCloseIndex) + logoElements + svg.substring(svgCloseIndex);
}

  private async svgToPng(svg: string, size: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.width = size;
      canvas.height = size;
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG image for PNG conversion. Check for cross-origin issues or invalid SVG.'));
      };
      
      try {
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(decodeURIComponent(encodeURIComponent(svg)));
        img.src = svgDataUrl;
      } catch (e) {
        reject(new Error(`Failed to create data URL from SVG: ${e instanceof Error ? e.message : String(e)}`));
      }
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