// import React, { useState } from "react";
// import CamDeviceSelector from "../components/videoChat/CamDeviceSelector";
// import MicDeviceSelector from "../components/videoChat/MicDeviceSelector";
// import { Divider, Stack, Typography } from "@mui/material";

// const TestDeviceSelectors = () => {
//   const [camDeviceId, setCamDeviceId] = useState("default");
//   const [micDeviceId, setMicDeviceId] = useState("default");

//   const [camDisabled, setCamDisabled] = useState(false);
//   const [micDisabled, setMicDisabled] = useState(false);

//   return (
//     <Stack direction="column" spacing={4} sx={{ p: 4 }}>
//       <Typography variant="h4">🎥📢 Cam & Mic Device Selector 테스트</Typography>

//       <Typography variant="h6">✅ 카메라 선택</Typography>
//       <CamDeviceSelector
//         deviceId={camDeviceId}
//         disabled={camDisabled}
//         onDeviceIdChanged={setCamDeviceId}
//         onDisabledChanged={setCamDisabled}
//       />
//       <Typography variant="body2">
//         현재 카메라 ID: <strong>{camDeviceId}</strong> / 상태:{" "}
//         <strong>{camDisabled ? "🚫 비활성화" : "✅ 활성화"}</strong>
//       </Typography>

//       <Divider />

//       <Typography variant="h6">✅ 마이크 선택</Typography>
//       <MicDeviceSelector
//         deviceId={micDeviceId}
//         disabled={micDisabled}
//         onDeviceIdChanged={setMicDeviceId}
//         onDisabledChanged={setMicDisabled}
//       />
//       <Typography variant="body2">
//         현재 마이크 ID: <strong>{micDeviceId}</strong> / 상태:{" "}
//         <strong>{micDisabled ? "🚫 비활성화" : "✅ 활성화"}</strong>
//       </Typography>
//     </Stack>
//   );
// };

// export default TestDeviceSelectors;
