import { observer } from 'mobx-react-lite';
import { Stack } from '@mui/material';
import CamDeviceSelector from './CamDeviceSelector';
import MicDeviceSelector from './MicDeviceSelector';
import { RoomConnector } from './RoomConnector';
import { useStore } from '../../features/videoChat/stores/StoreContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./VideoChat.css";

const VideoChatLanding = () => {
    const { roomStore } = useStore();
    console.log('VideoChatLanding roomStore ===', roomStore);
    const {
        camDisabled,
        selectedCamId,
        micDisabled,
        selectedMicId,
        isJoining,
        isJoinSuccess,
        roomId,
    } = roomStore;
    const navigate = useNavigate();

    // 스터디 이름 가져와서 url로
    useEffect(() => {
        if (isJoinSuccess && roomId) {
            console.log(roomId)
            // navigate('/video-chat');
        } else {
            console.log('no roomId')
            navigate('/chat')
        }
    }, [isJoinSuccess, navigate, roomId]);

    const handleChangeCamDisabled = (disabled: boolean) => {
        roomStore.setCamDisabled(disabled);
    };

    const handleChangeSelectedCamId = (deviceId: string) => {
        roomStore.setSelectedCamId(deviceId);
    };

    const handleChangeMicDisabled = (disabled: boolean) => {
        roomStore.setMicDisabled(disabled);
    };

    const handleChangeSelectedMicId = (deviceId: string) => {
        roomStore.setSelectedMicId(deviceId);
    };

    const handleJoin = (roomId: string) => {
        roomStore.join(roomId);
    };

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
        >
            <Stack
                direction="column"
                spacing={2}
                sx={{ justifyContent: 'center', alignItems: 'center', padding: '16px' }}
            >
                <h1>Web MediaStream Study Project</h1>
                <h1>Join the web Meeting</h1>
            </Stack>
            <Stack
                direction="column"
                spacing={1}
                sx={{ justifyContent: 'center', alignItems: 'stretch', width: '400px' }}
            >
                <CamDeviceSelector
                    disabled={camDisabled}
                    deviceId={selectedCamId}
                    onDisabledChanged={handleChangeCamDisabled}
                    onDeviceIdChanged={handleChangeSelectedCamId}
                />

                <MicDeviceSelector
                    disabled={micDisabled}
                    deviceId={selectedMicId}
                    onDisabledChanged={handleChangeMicDisabled}
                    onDeviceIdChanged={handleChangeSelectedMicId}
                />

                <RoomConnector joining={isJoining} onJoin={handleJoin} />
            </Stack>
        </Stack>
    );
};

export default observer(VideoChatLanding);
