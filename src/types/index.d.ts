export type QRConfig = {
  data: string;
  version?: number | 'auto';
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  size?: number;
  margin?: number;
  colorDark?: string;
  colorLight?: string;
  roundedModules?: boolean;
  eyeStyle?: 'square' | 'circle';
  logo?: {
    src?: string;
    size?: number;
  };
};

export type QRScanResult = {
  data: string;
  rawText?: string;
  file?: string;
  format?: string;
  timestamp: number;
};

export type QRHistoryItem = {
  id: string;
  type: 'created' | 'scanned';
  data: string;
  config?: QRConfig;
  scanResult?: QRScanResult;
  timestamp: number;
};



export type ExportFormat = 'png' | 'svg' | 'jpg';