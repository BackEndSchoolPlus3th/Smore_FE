import { observer } from 'mobx-react-lite';
import { Stack,Button } from '@mui/material';
import CamDeviceSelector from './CamDeviceSelector';
import MicDeviceSelector from './MicDeviceSelector';
import { useStore } from '../../features/videoChat/stores/StoreContext';
import { useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const VideoChatLanding = () => {
    /** JWT 디코딩하여 사용자 ID(subject) 추출 */
    const getUserIdFromToken = (token: string): string => {
        try {
            if (!token || token === '') {
                console.warn('JWT 토큰이 비어있습니다.');
                return 'anonymous';
            }
            const actualToken = token.startsWith('Bearer ')
                ? token.substring(7)
                : token;
            const decoded: any = jwtDecode(actualToken);
            console.log('JWT 디코딩 결과:', decoded);
    
            if (!decoded) {
                console.error('JWT 디코딩 결과가 없습니다.');
                return 'anonymous';
            }
            if (!decoded.sub) {
                console.error('JWT에서 sub 필드를 찾을 수 없습니다:', decoded);
                if (decoded.userId) {
                    return String(decoded.userId);
                } else if (decoded.id) {
                    return String(decoded.id);
                }
                return 'anonymous';
            }
            console.log('현재 로그인 사용자 ID(JWT sub 필드):', decoded.sub);
            return String(decoded.sub);
        } catch (error) {
            console.error('JWT 디코딩 실패:', error);
            console.error('토큰 값:', token.substring(0, 20) + '...');
            return 'anonymous';
        }
    };

    const { roomStore } = useStore();
    // console.log('VideoChatLanding roomStore ===', roomStore);
    // const { study_id: studyId } = useParams();
    
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

    // 스터디 아이디 가져와서 화상채팅방으로
    useEffect(() => {
        if (isJoinSuccess && roomId) {
            console.log("videoChatRoom에서 roomId = ",roomId)
            navigate(`/video-chat/room/${roomId}`);

         }}, [isJoinSuccess, navigate]);

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

    const handleJoin = () => {
        const token = localStorage.getItem('accessToken');
        console.log(`token ${token}`)
        
        if(roomId && token) {
            const userId =getUserIdFromToken(token)
            roomStore.join(roomId,userId, token);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div
                className="w-full max-w-md flex flex-col gap-4 p-6 rounded-xl shadow-lg"
                style={{
                fontFamily: 'system-ui, sans-serif',
                color: '#1a202c',
                lineHeight: '1.5',
                }}
            >
                <Stack
                direction={{ xs: 'column', md: 'column' }}
                spacing={3}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh', // 살짝 줄임
                }}
                >
                <h1 className="text-2xl font-bold text-center mb-4">
                    화상 채팅 방에 입장하기</h1>
                {/* 디바이스 선택기 */}
                <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
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
                </Stack>

                {/* 입장 버튼 */}
                <Button
                    variant="contained"
                    onClick={handleJoin}
		    loading={isJoining}
                    style={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: 'system-ui, sans-serif',
                    marginTop: '1rem',
                    }}
                >
                    입 장
                </Button>
                </Stack>
            </div>
        </div>
    );
};

export default observer(VideoChatLanding);
