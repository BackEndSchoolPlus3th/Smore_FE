import { useState, useEffect } from 'react';
import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
} from 'livekit-client';

import '../../../pages/videoChat/VideoChatPage.css';
import VideoComponent from './VideoComponent';
import AudioComponent from './AudioComponent';
import { getToken } from '../../../features/videoChat/getToken';
import { CancleButton } from '../../../shared';

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
            APPLICATION_SERVER_URL =
                'https://' + window.location.hostname + ':6443/';
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

function LivekitChatBoard() {
    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
        undefined
    );
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

    const [participantName, setParticipantName] = useState('participantName');
    const [roomName, setRoomName] = useState('Test Room');

    useEffect(() => {
        joinRoom();
    }, []);

    async function joinRoom() {
        const room = new Room();
        setRoom(room);

        room.on(
            RoomEvent.TrackSubscribed,
            (
                _track: RemoteTrack,
                publication: RemoteTrackPublication,
                participant: RemoteParticipant
            ) => {
                setRemoteTracks((prev) => [
                    ...prev,
                    {
                        trackPublication: publication,
                        participantIdentity: participant.identity,
                    },
                ]);
            }
        );

        room.on(
            RoomEvent.TrackUnsubscribed,
            (_track: RemoteTrack, publication: RemoteTrackPublication) => {
                setRemoteTracks((prev) =>
                    prev.filter(
                        (track) =>
                            track.trackPublication.trackSid !==
                            publication.trackSid
                    )
                );
            }
        );

        try {
            const data = JSON.parse(await getToken());
            const token = data.token;
            const participantName = data.UserEmail;
            const roomName = data.StudyTitle;
            console.log('Token:', token);

            setParticipantName(participantName);
            setRoomName(roomName);

            await room.connect(LIVEKIT_URL, token);

            await room.localParticipant.enableCameraAndMicrophone();
            const videoTrackPublication =
                room.localParticipant.videoTrackPublications
                    .values()
                    .next().value;
            if (videoTrackPublication) {
                setLocalTrack(videoTrackPublication.videoTrack);
            }
        } catch (error) {
            console.log(
                'There was an error connecting to the room:',
                (error as Error).message
            );
            await leaveRoom();
        }
    }

    async function leaveRoom() {
        await room?.disconnect();
        setRoom(undefined);
        setLocalTrack(undefined);
        setRemoteTracks([]);
    }

    return (
        <div className="col-span-6 h-full border border-gray-200 rounded-xl shadow-md flex flex-col p-4">
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl font-bold">{roomName}</p>
                <CancleButton onClick={leaveRoom} label="Leave Room" />
            </div>
            <div id="layout-container">
                {localTrack && (
                    <VideoComponent
                        track={localTrack}
                        participantIdentity={participantName}
                        local={true}
                    />
                )}
                {remoteTracks.map((remoteTrack) =>
                    remoteTrack.trackPublication.kind === 'video' ? (
                        <VideoComponent
                            key={remoteTrack.trackPublication.trackSid}
                            track={remoteTrack.trackPublication.videoTrack!}
                            participantIdentity={
                                remoteTrack.participantIdentity
                            }
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
export default LivekitChatBoard;
