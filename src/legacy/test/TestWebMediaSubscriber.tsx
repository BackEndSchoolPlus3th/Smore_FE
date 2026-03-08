// import React, { useEffect, useRef, useState } from "react";
// import { Button, Stack, Typography } from "@mui/material";
// import { WebMediaSubscriber } from "../features/videoChat/WebMediaSubscriber";

// const apiUrl = "http://localhost:1985"; // 본인의 signaling 서버 주소
// const streamUrl = "webrtc://localhost"; // 본인의 stream 주소 prefix

// const appId = "live";
// const feedId = "publisher1"; // WebMediaPublisher에서 송출 중인 feedId와 일치해야 함

// const TestWebMediaSubscriber: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [subscriber, setSubscriber] = useState<ReturnType<typeof WebMediaSubscriber> | null>(null);
//     const [isSubscribed, setIsSubscribed] = useState(false);

//     const startSubscribe = async () => {
//         const sub = WebMediaSubscriber(apiUrl, streamUrl);
//         setSubscriber(sub);

//         try {
//             const result = await sub.subscribe(appId, feedId);
//             console.log("✅ WebMediaSubscriber.subscribe() 성공:", result);

//             // 스트림 연결
//             if (videoRef.current) {
//                 videoRef.current.srcObject = sub.stream;
//             }

//             setIsSubscribed(true);
//         } catch (err) {
//             console.error("❌ subscribe 실패:", err);
//         }
//     };

//     const stopSubscribe = () => {
//         if (subscriber) {
//             subscriber.close();
//             setSubscriber(null);
//             setIsSubscribed(false);

//             if (videoRef.current) {
//                 videoRef.current.srcObject = null;
//             }
//         }
//     };

//     useEffect(() => {
//         return () => {
//             stopSubscribe();
//         };
//     }, []);

//     return (
//         <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
//             <Typography variant="h5">📺 WebMediaSubscriber 테스트</Typography>

//             <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 controls={false}
//                 style={{
//                     width: "480px",
//                     height: "360px",
//                     background: "black",
//                     objectFit: "cover",
//                 }}
//             />

//             <Stack direction="row" spacing={2}>
//                 <Button variant="contained" color="primary" onClick={startSubscribe} disabled={isSubscribed}>
//                     ▶️ 구독 시작
//                 </Button>
//                 <Button variant="outlined" color="error" onClick={stopSubscribe} disabled={!isSubscribed}>
//                     ⏹️ 구독 종료
//                 </Button>
//             </Stack>

//             <Typography variant="body2" color="text.secondary">
//                 streamURL: <code>{`${streamUrl}/${appId}/${feedId}`}</code>
//             </Typography>
//         </Stack>
//     );
// };

// export default TestWebMediaSubscriber;
