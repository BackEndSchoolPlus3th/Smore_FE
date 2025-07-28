import { observer } from 'mobx-react-lite';
import { Stack } from '@mui/material';
import CamDeviceSelector from './CamDeviceSelector';
import MicDeviceSelector from './MicDeviceSelector';
import { RoomConnector } from './RoomConnector';
import { useStore } from '../../features/videoChat/stores/StoreContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoChatLanding = () => {
    const { roomStore } = useStore();
    const {
        camDisabled,
        selectedCamId,
        micDisabled,
        selectedMicId,
        isJoining,
        isJoinSuccess
    } = roomStore;
    const navigate = useNavigate();

    useEffect(() => {
        if (isJoinSuccess) {
            navigate('/video-chat/room');
        }
    }, [isJoinSuccess, navigate]);

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
