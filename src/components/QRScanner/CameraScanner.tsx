import type { Component } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';
import { qrScanner } from '../../services/qrScanner';
import type { QRScanResult } from '../../types';
import { Button } from '../UI/Button';
import { t } from '../../stores/i18n';

interface CameraScannerProps {
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
  setError: (error: string | null) => void;
  onScanComplete: (result: QRScanResult) => void;
}

export const CameraScanner: Component<CameraScannerProps> = (props) => {
  const [cameraStream, setCameraStream] = createSignal<MediaStream | null>(null);
  let videoRef: HTMLVideoElement | undefined;

  const checkCameraPermission = async (): Promise<{ granted: boolean; error?: string }> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { granted: false, error: t('scan.camera.camera_not_available') };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        stream.getTracks().forEach(track => track.stop());
        return { granted: false, error: t('scan.camera.camera_not_available') };
      }
      
      stream.getTracks().forEach(track => track.stop());
      
      return { granted: true };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
          return { granted: false, error: t('scan.camera.camera_permission_denied') };
        }
        if (error.name === 'NotFoundError' || error.message.includes('No camera found')) {
          return { granted: false, error: t('scan.camera.camera_not_available') };
        }
      }
      return { granted: false, error: t('scan.camera.camera_not_available') };
    }
  };

  const startCameraScan = async () => {
    if (!videoRef) return;

    props.setIsScanning(true);
    props.setError(null);

    try {
      const permissionCheck = await checkCameraPermission();
      if (!permissionCheck.granted) {
        throw new Error(permissionCheck.error || t('scan.camera.camera_not_available'));
      }

      await qrScanner.startCamera(
        videoRef,
        async (result) => {
          props.onScanComplete(result);
          stopCameraScan();
        },
        (err) => {
          props.setError(err.message);
          stopCameraScan();
        }
      );

      const stream = videoRef.srcObject as MediaStream;
      setCameraStream(stream);
    } catch (err) {
      props.setError(err instanceof Error ? err.message : t('create.camera_scanner.failed_to_start_camera'));
      props.setIsScanning(false);
    }
  };

  const stopCameraScan = async () => {
    try {
      await qrScanner.stopCamera();
      
      if (cameraStream()) {
        cameraStream()!.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      
      if (videoRef) {
        videoRef.srcObject = null;
      }
    } catch (err) {
      console.error('Error stopping camera:', err);
    } finally {
      props.setIsScanning(false);
    }
  };

  onCleanup(() => {
    stopCameraScan();
  });

  return (
    <div class="space-y-4">
      <div class="bg-black rounded-lg overflow-hidden" style="height: 400px;">
        <video
          ref={videoRef}
          class="w-full h-full object-cover"
          autoplay
          playsinline
        />
      </div>
      <div class="flex space-x-2">
        <Button
          onClick={startCameraScan}
          disabled={props.isScanning}
          loading={props.isScanning}
          class="flex-1"
        >
          {t('scan.camera.start_camera')}
        </Button>
        <Button
          variant="outline"
          onClick={stopCameraScan}
          disabled={!props.isScanning}
          class="flex-1"
        >
          {t('scan.camera.stop_camera')}
        </Button>
      </div>
    </div>
  );
};