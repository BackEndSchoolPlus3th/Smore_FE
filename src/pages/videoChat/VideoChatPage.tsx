import { useState, useEffect } from 'react';
import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent
} from 'livekit-client';
import './VideoChatPage.css';
import VideoComponent from '../../components/livekit/VideoComponent';
import AudioComponent from '../../components/livekit/AudioComponent';

type TrackInfo = {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
};

let APPLICATION_SERVER_URL = '';
let LIVEKIT_URL = 'wss://chat-app-y0a5829d.livekit.cloud';
configureUrls();

function configureUrls() {
    if (!APPLICATION_SERVER_URL) {
        if (window.location.hostname === 'localhost') {
            APPLICATION_SERVER_URL = 'http://localhost:8090/api/v1/';
        } else {
            APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
        }
    }

    if (!LIVEKIT_URL) {
        if (window.location.hostname === 'localhost') {
            LIVEKIT_URL = 'ws://localhost:7880/';
        } else {
            LIVEKIT_URL = 'wss://' + window.location.hostname + ':7443/';
        }
    }
}

function VideoChatPage() {
    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

    const participantName = 'Participant' + Math.floor(Math.random() * 100);
    const roomName = 'Test Room';

    useEffect(() => {
        joinRoom();
    }, []);

    async function joinRoom() {
        const room = new Room();
        setRoom(room);

        room.on(
            RoomEvent.TrackSubscribed,
            (_track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    { trackPublication: publication, participantIdentity: participant.identity }
                ]);
            }
        );

        room.on(RoomEvent.TrackUnsubscribed, (_track: RemoteTrack, publication: RemoteTrackPublication) => {
            setRemoteTracks((prev) => prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid));
        });

        try {
            const token = await getToken(roomName, participantName);
            console.log('Token:', token);
            await room.connect(LIVEKIT_URL, token);

            await room.localParticipant.enableCameraAndMicrophone();
            setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
        } catch (error) {
            console.log('There was an error connecting to the room:', (error as Error).message);
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        await room?.disconnect();
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
    }

    async function getToken(roomName: string, participantName: string) {
        const response = await fetch(APPLICATION_SERVER_URL + 'token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomName: roomName,
                participantName: participantName
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get token: ${error.errorMessage}`);
        }

        const data = await response.json();
        return data.token;
    }

    return (
        <div id="room">
            <div id="room-header">
                <h2 id="room-title">{roomName}</h2>
                <button className="btn btn-danger" id="leave-room-button" onClick={leaveRoom}>
                    Leave Room
                </button>
            </div>
            <div id="layout-container">
                {localTrack && <VideoComponent track={localTrack} participantIdentity={participantName} local={true} />}
                {remoteTracks.map((remoteTrack) =>
                    remoteTrack.trackPublication.kind === 'video' ? (
                        <VideoComponent
                            key={remoteTrack.trackPublication.trackSid}
                            track={remoteTrack.trackPublication.videoTrack!}
                            participantIdentity={remoteTrack.participantIdentity}
                        />
                    ) : (
                        <AudioComponent
                            key={remoteTrack.trackPublication.trackSid}
                            track={remoteTrack.trackPublication.audioTrack!}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default VideoChatPage;
