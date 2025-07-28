import { useEffect, RefObject } from 'react';

export function useVideoStream(videoRef: RefObject<HTMLVideoElement>, stream: MediaStream | null) {
  useEffect(() => {
    if (stream) {
      if (videoRef.current) {
        const streamId = videoRef.current.dataset.streamId;
        // 중복 방지
        if (streamId !== stream.id) {
          videoRef.current.srcObject = stream;
          videoRef.current.dataset.streamId = stream.id;
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.dataset.streamId = '';
      }
    }

    return () => {
      // 클린업
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.dataset.streamId = '';
      }
    };
  }, [videoRef, stream]);
}
