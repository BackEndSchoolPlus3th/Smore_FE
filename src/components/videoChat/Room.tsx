import { observer } from 'mobx-react-lite';
import { IconButton, Stack } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../features/videoChat/stores/StoreContext';
import { useVideoStream } from '../../features/videoChat/hooks/useVideoStream'

const Room: React.FC = () => {
    const navigate = useNavigate();
    const { roomStore } = useStore();
    const { isJoinSuccess, publishStream, subscribeStream } = roomStore;
    const [isMuted, setIsMuted] = useState(true);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.addEventListener('volumechange', onVolumeChange);
        }
        return () => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.removeEventListener('volumechange', onVolumeChange);
            }
        };
    }, []);

    useEffect(() => {
        if (isJoinSuccess) {
            roomStore.publish();
        } else {
            navigate('/');
        }
    }, [isJoinSuccess]);

    useVideoStream(localVideoRef, publishStream);
    useVideoStream(remoteVideoRef, subscribeStream);

    const onVolumeChange = (event: Event) => {
        const target = event.target as HTMLVideoElement;
        setIsMuted(target.muted);
    };

    const toggleMuted = () => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.muted = !isMuted;
        }
    };

    const handleClickExit = () => {
        roomStore.exit();
    };

    return (
        <div className="col-span-6 w-full h-full flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md">
             <h2 className="text-2xl font-bold mb-2">🎥 WebRTC 화상채팅</h2>

            <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                {/* 상대방 비디오 */}
                <div className="flex-1 bg-black rounded-lg overflow-hidden">
                    <video
                    ref={remoteVideoRef}
                    autoPlay 
                    muted
                    
                    className="w-full h-full object-contain"
                    />
                </div>

                {/* 내 비디오 */}
                <div className="flex-1 bg-black rounded-lg overflow-hidden">
                    <video
                    ref={localVideoRef}
                    autoPlay 
                    
                    muted
                    className="w-full h-full object-contain"
                    />
                </div>
                </div>
            </div>
    );
};

export default observer(Room);
