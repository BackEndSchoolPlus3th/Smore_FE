import React, { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import "./VideoChat.css";
const socket = io();

const VideoChat: React.FC = () => {
    // 비디오 요소, 버튼, 폼 등의 DOM에 접근하기 위해 ref 사용
    const myFaceRef = useRef<HTMLVideoElement>(null);         // 내 비디오
    const peerFaceRef = useRef<HTMLVideoElement>(null);       // 상대 비디오
    const muteBtnRef = useRef<HTMLButtonElement>(null);       // 음소거 버튼
    const cameraBtnRef = useRef<HTMLButtonElement>(null);     // 카메라 끄기 버튼
    const cameraSelectRef = useRef<HTMLSelectElement>(null);  // 카메라 선택 드롭다운
    const welcomeRef = useRef<HTMLDivElement>(null);          // 초기 화면
    const callRef = useRef<HTMLDivElement>(null);             // 화상채팅 화면
    const roomNameRef = useRef<HTMLSpanElement>(null);        // 방 이름 표시
    const roomNameInputRef = useRef<HTMLInputElement>(null);  // 방 이름 입력
    const formRef = useRef<HTMLFormElement>(null);            // 폼 요소

    const [muted, setMuted] = useState(false);                // 음소거 상태
    const [cameraOff, setCameraOff] = useState(false);        // 카메라 꺼짐 여부

    const roomName = useRef<string>("");                      // 방 이름 저장
    const myStream = useRef<MediaStream | null>(null);        // 내 영상 스트림
    const myPeerConnection = useRef<RTCPeerConnection | null>(null); // 피어 연결
    const myDataChannel = useRef<RTCDataChannel | null>(null);       // 데이터 채널
  
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.current?.getVideoTracks()[0];
  
        if (cameraSelectRef.current) {
          cameraSelectRef.current.innerHTML = "";
          cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera?.label === camera.label) {
              option.selected = true;
            }
            cameraSelectRef.current?.appendChild(option);
          });
        }
      } catch {
        console.log("Failed to enumerate connected devices");
      }
    };
  
    const getMedia = async (deviceId?: string) => {
      const initialConstraints = {
        audio: true,
        video: { facingMode: "user" },
      };
      const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId! } },
      };
      try {
        myStream.current = await navigator.mediaDevices.getUserMedia(
          deviceId ? cameraConstraints : initialConstraints
        );
        if (myFaceRef.current) {
          myFaceRef.current.srcObject = myStream.current;
        }
        if (!deviceId) await getCameras();
      } catch (e) {
        console.error(e);
      }
    };
  
    const handleMuteClick = () => {
      if (myStream.current) {
        myStream.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
        setMuted(prev => {
          if (muteBtnRef.current) muteBtnRef.current.innerText = prev ? "Mute" : "Unmute";
          return !prev;
        });
      }
    };
  
    const handleCameraClick = () => {
      if (myStream.current) {
        myStream.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
        setCameraOff(prev => {
          if (cameraBtnRef.current) cameraBtnRef.current.innerText = prev ? "Turn camera Off" : "Turn camera On";
          return !prev;
        });
      }
    };
  
    const handleCameraChange = async () => {
      await getMedia(cameraSelectRef.current?.value);
      if (myPeerConnection.current && myStream.current) {
        const videoTrack = myStream.current.getVideoTracks()[0];
        const videoSender = myPeerConnection.current.getSenders().find(sender => sender.track?.kind === "video");
        videoSender?.replaceTrack(videoTrack);
      }
    };
  
    const handleWelcomeSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const room = roomNameInputRef.current?.value.trim();
      if (!room) return;
      roomName.current = room;
      await initCall();
      socket.emit("join_room", room);
      if (roomNameInputRef.current) roomNameInputRef.current.value = "";
    };
  
    const initCall = async () => {
      if (welcomeRef.current) welcomeRef.current.hidden = true;
      if (callRef.current) callRef.current.hidden = false;
      await getMedia();
      makeConnection();
    };
  
    const makeConnection = () => {
      myPeerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
  
      myPeerConnection.current.addEventListener("icecandidate", handleIce);
      myPeerConnection.current.addEventListener("addstream", handleAddStream);
  
      myStream.current?.getTracks().forEach(track =>
        myPeerConnection.current?.addTrack(track, myStream.current!)
      );
    };
  
    const handleIce = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        socket.emit("ice", event.candidate, roomName.current);
      }
    };
  
    const handleAddStream = (event: MediaStreamEvent) => {
      if (peerFaceRef.current) {
        peerFaceRef.current.srcObject = event.stream;
      }
    };
  
    useEffect(() => {
      socket.on("welcome", async () => {
        myDataChannel.current = myPeerConnection.current?.createDataChannel("chat") || null;
        myDataChannel.current?.addEventListener("message", (msg) => {
          console.log("Received message:", msg.data);
        });
  
        const offer = await myPeerConnection.current?.createOffer();
        if (offer) {
          await myPeerConnection.current?.setLocalDescription(offer);
          socket.emit("offer", offer, roomName.current);
        }
      });
  
      socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
        myPeerConnection.current?.addEventListener("datachannel", event => {
          myDataChannel.current = event.channel;
          myDataChannel.current.addEventListener("message", (msg) => {
            console.log("Received message:", msg.data);
          });
        });
  
        await myPeerConnection.current?.setRemoteDescription(offer);
        const answer = await myPeerConnection.current?.createAnswer();
        await myPeerConnection.current?.setLocalDescription(answer!);
        socket.emit("answer", answer, roomName.current);
      });
  
      socket.on("answer", (answer: RTCSessionDescriptionInit) => {
        myPeerConnection.current?.setRemoteDescription(answer);
      });
  
      socket.on("ice", (candidate: RTCIceCandidate) => {
        myPeerConnection.current?.addIceCandidate(candidate);
      });
    }, []);
  
    return (
      <div>
        <div id="welcome" ref={welcomeRef}>
          <form ref={formRef} onSubmit={handleWelcomeSubmit}>
            <input type="text" placeholder="Room name" ref={roomNameInputRef} />
            <button type="submit">Join</button>
          </form>
        </div>
  
        <div id="call" ref={callRef} hidden>
          <div>
            <video id="myFace" ref={myFaceRef} autoPlay playsInline />
            <video id="peerFace" ref={peerFaceRef} autoPlay playsInline />
          </div>
          <button ref={muteBtnRef} onClick={handleMuteClick}>Mute</button>
          <button ref={cameraBtnRef} onClick={handleCameraClick}>Turn Camera Off</button>
          <select ref={cameraSelectRef} onChange={handleCameraChange}></select>
          <div>
            Room: <span ref={roomNameRef}></span>
          </div>
        </div>
      </div>
    );
  };
  
  export default VideoChat;