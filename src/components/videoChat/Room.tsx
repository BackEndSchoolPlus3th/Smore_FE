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
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <video
                ref={remoteVideoRef}
                autoPlay
                muted
                style={{
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100%',
                    height: '100%',
                    background: 'black',
                    objectFit: 'contain',
                }}
            />
            <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                    position: 'absolute',
                    right: '24px',
                    bottom: '24px',
                    width: '35%',
                    height: '35%',
                    background: 'transparent',
                    objectFit: 'contain',
                }}
            />

            <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: 'flex-end', alignItems: 'center', position: 'absolute', top: '16px', right: '16px' }}
            >
                <IconButton
                    disabled={!subscribeStream}
                    style={{ color: !subscribeStream ? 'grey' : isMuted ? 'red' : 'lightgrey' }}
                    onClick={toggleMuted}
                >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>

                <IconButton style={{ color: 'lightgrey' }} onClick={handleClickExit}>
                    <ExitToAppIcon />
                </IconButton>
            </Stack>
        </div>
    );
};

export default observer(Room);
