import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

// ✅ Props 타입 정의
interface CamDeviceSelectorProps {
  disabled: boolean;
  deviceId: string;
  onDisabledChanged: (disabled: boolean) => void;
  onDeviceIdChanged: (deviceId: string) => void;
}

interface MediaDeviceInfoWithLabel extends MediaDeviceInfo {
  label: string;
}


const CamDeviceSelector: React.FC<CamDeviceSelectorProps> = ({
  disabled,
  deviceId,
  onDisabledChanged,
  onDeviceIdChanged,
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfoWithLabel[]>([]);
  const mediaPlayerRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 페이지가 클린업될 때 미디어 스트림 해제
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  // deviceId 바뀔 때마다 스트림 재요청
  useEffect(() => {
// 이전 미디어 스트림 해제
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    const constraints: MediaStreamConstraints = {
      video: { deviceId },
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((newMediaStream) => {
// 이전에 실패해서 disabled였다면, 이제 성공했으니 'false'로 상태 변경
        if (disabled) {
          onDisabledChanged(false);
        }

// 미리보기 출력
        if (mediaPlayerRef.current) {
          mediaPlayerRef.current.srcObject = newMediaStream;
        }

// 추후 스트림 제어하기 위한 변수 저장
        mediaStreamRef.current = newMediaStream;
      })
      .catch(() => {
        if (!disabled) {
          onDisabledChanged(true);
        }
      });
  }, [deviceId, disabled, onDisabledChanged]);

  // 디바이스 목록 업데이트
  const enumerateDevices = () => {
    if (!disabled) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((deviceInfos) => {
          const cams = deviceInfos.filter(
            (deviceInfo) =>
              deviceInfo.kind === "videoinput" &&
              deviceInfo.deviceId !== "default"
          );
          setDevices(cams);
        })
        .catch(() => {
          setDevices([]);
        });
    }
  };

  // 카메라 변경 이벤트 핸들러
  const handleChangeCamId = (event: SelectChangeEvent) => {
    onDeviceIdChanged(event.target.value);
  };

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ justifyContent: "center", alignItems: "center" }}
    >
      <video
        ref={mediaPlayerRef}
        autoPlay
        muted
        style={{
          width: "400px",
          height: "250px",
          background: "black",
          objectFit: "contain",
        }}
      />
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>카메라 장치</InputLabel>
        <Select
          value={deviceId || "default"}
          onOpen={enumerateDevices}
          onChange={handleChangeCamId}
        >
          <MenuItem value="default">기본 장치</MenuItem>
          {devices.length > 0 &&
          devices.map((device, index) => (
            <MenuItem
              key={`cam-devices-${index}-${device.deviceId}`}
              value={device.deviceId}
            >
              {device.label || `카메라 ${index + 1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default CamDeviceSelector;


