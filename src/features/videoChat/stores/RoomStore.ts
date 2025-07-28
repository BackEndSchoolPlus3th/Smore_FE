import { flow, makeAutoObservable } from 'mobx';
import { WebMediaPublisher } from '../WebMediaPublisher';
import { WebMediaSubscriber } from '../WebMediaSubscriber';
import { WebMediaClient } from '../WebMediaClient';



const Status = {
    None: 'none',
    Ing: 'ing',
    Success: 'success',
    Error: 'error',
} as const;

export type StatusType = keyof typeof Status;

export class RoomStore {
    camDisabled: boolean;
    selectedCamId: string;
    micDisabled: boolean;
    selectedMicId: string;

    roomId: string | null;
    status: string;
    client: WebMediaClient | null;
    apiUrl: string | null;
    streamUrl: string | null;
    user: any;
    anotherUser: any;

    publishStatus: string;
    publisher: ReturnType<typeof WebMediaPublisher> | null;
    publishStream: MediaStream | null;

    subscribeStatus: string;
    subscriber: ReturnType<typeof WebMediaSubscriber> | null;
    subscribeStream: MediaStream | null;

    constructor() {
        this.camDisabled = true;
        this.selectedCamId = 'default';
        this.micDisabled = true;
        this.selectedMicId = 'default';

        this.roomId = null;
        this.status = Status.None;
        this.client = null;
        this.apiUrl = null;
        this.streamUrl = null;
        this.user = null;
        this.anotherUser = null;

        this.publishStatus = Status.None;
        this.publisher = null;
        this.publishStream = null;

        this.subscribeStatus = Status.None;
        this.subscriber = null;
        this.subscribeStream = null;


        // 클래스의 모든 상태, 메서드를 MobX에서 자동 추적할 수 있게 함
        // {}는 특정 필드 제외 혹은 명시적 설정 가능, 현재는 생략
        makeAutoObservable(this, {});
    }

    setCamDisabled(disabled: boolean) {
        this.camDisabled = disabled;
    }

    setSelectedCamId(deviceId: string) {
        this.selectedCamId = deviceId;
    }

    setMicDisabled(disabled: boolean) {
        this.micDisabled = disabled;
    }

    setSelectedMicId(deviceId: string) {
        this.selectedMicId = deviceId;
    }

    get isJoining() {
        return this.status === Status.Ing;
    }

    get isJoinSuccess() {
        return this.status === Status.Success;
    }

    join = flow(function* (this: RoomStore, roomId: string) {
        if (this.status !== Status.Ing && this.status !== Status.Success) {
            this.roomId = roomId;
            this.status = Status.Ing;

            const websocketUrl = 'ws://localhost:8090/webmedia-ws';
            const client = new WebMediaClient(this._onMessage);

            try {
                yield client.connect(websocketUrl, roomId);
                this.client = client;

                const message = yield this._sendJoinMessage();
                console.log('Join 성공', message);

                this.apiUrl = message.apiUrl;
                this.streamUrl = message.streamUrl;
                this.user = message.user;
                this.anotherUser = message.anotherUser;

                this.status = Status.Success;
            } catch (error) {
                console.log('Join 실패', error);
                this.client?.close();

                this.roomId = null;
                this.client = null;
                this.apiUrl = null;
                this.streamUrl = null;
                this.user = null;
                this.anotherUser = null;

                this.status = Status.Error;
            }
        } else {
            console.log('이미 접속 중입니다');
        }
    });

    publish = flow(function* (this: RoomStore) {
        if (
            this.client &&
            this.isJoinSuccess &&
            this.user &&
            this.publishStatus !== Status.Ing &&
            this.publishStatus !== Status.Success
        ) {
            try {
                this.publishStatus = Status.Ing;

                // 초기화
                this.publishStream?.getTracks().forEach((track) => track.stop());
                this.publisher?.close();

                const constraints: MediaStreamConstraints = {
                    video: {
                        deviceId: this.selectedCamId,
                    },
                    audio: {
                        deviceId: this.selectedMicId,
                        echoCancellation: false,
                        noiseSuppression: true,
                    },
                };

                this.publishStream = yield navigator.mediaDevices.getUserMedia(constraints);
                if (this.publishStream) {
                    //apiUrl! (non-null assertion) : "이 값은 무조건 null이 아님"
                    this.publisher = WebMediaPublisher(this.apiUrl!, this.streamUrl!);

                    // publisher 로컬 변수 생성 안되어 있고, 클래스 인스턴스 변수(this.publisher) 접근해야 하니까
                    const session = yield this.publisher.publish(
                        this.publishStream,
                        this.roomId!,
                        this.user.userId
                    );
                    console.log('Publish 성공', session);
                    yield this._reportPublishedChange(true);
                    this.publishStatus = Status.Success;
                }
            } catch (error) {
                console.log('Publish 실패', error);

                this.publishStream?.getTracks().forEach((track) => track.stop());
                this.publisher?.close();

                this.publisher = null;
                this.publishStream = null;
                this.publishStatus = Status.Error;
            }

            if (this.anotherUser?.published) {
                this.subscribe();
            }
        }
    });

    subscribe = flow(function* (this: RoomStore) {
        // this.subscribeStatus !== Status.Success 없음 -> 이미 구독했어도 조건이 바뀌면(상대방 재접속) 다시 구독
        if (
            this.client &&
            this.isJoinSuccess &&
            this.anotherUser &&
            this.anotherUser.published &&
            this.subscribeStatus !== Status.Ing
        ) {
            try {
                this.subscribeStatus = Status.Ing;
                this.subscribeStream?.getTracks().forEach((track) => track.stop());
                this.subscriber?.close();

                this.subscriber = WebMediaSubscriber(this.apiUrl!, this.streamUrl!);
                const session = yield this.subscriber.subscribe(
                    this.roomId!,
                    this.anotherUser.userId
                );
                console.log('Subscribe 성공', session);
                this.subscribeStream = this.subscriber.stream;
                this.subscribeStatus = Status.Success;
            } catch (error) {
                console.log('Subscribe 실패', error);

                this.subscribeStream?.getTracks().forEach((track) => track.stop());
                this.subscriber?.close();

                this.subscriber = null;
                this.subscribeStream = null;
                this.subscribeStatus = Status.Error;
            }
        }
    });

    exit() {
        this.subscribeStream?.getTracks().forEach((track) => track.stop());
        this.publishStream?.getTracks().forEach((track) => track.stop());
        this.subscriber?.close();
        this.publisher?.close();
        this.client?.close();

        this.selectedCamId = 'default';
        this.selectedMicId = 'default';

        this.roomId = null;
        this.status = Status.None;
        this.client = null;
        this.apiUrl = null;
        this.streamUrl = null;
        this.user = null;
        this.anotherUser = null;

        this.publishStatus = Status.None;
        this.publisher = null;
        this.publishStream = null;
        this.subscribeStatus = Status.None;
        this.subscriber = null;
        this.subscribeStream = null;
    }

    // webMedia Client 생성 시 파라미터로
    _onMessage = (container: any) => {
        console.log('메세지 수신', container);
        const { type, message } = container;

        if (type === 'UserJoinedEvent') {
            const { user } = message;
            this.anotherUser = user;
            if (this.anotherUser.published) this.subscribe();
        } else if (type === 'UserStateChangedEvent') {
            const { userId, published } = message;
            if (this.anotherUser?.userId === userId) {
                this.anotherUser = { ...this.anotherUser, published };
                if (published) this.subscribe();
                else {
                    this.subscribeStream?.getTracks().forEach((track) => track.stop());
                    this.subscriber?.close();
                    this.subscriber = null;
                    this.subscribeStream = null;
                    this.subscribeStatus = Status.None;
                }
            }
        } else if (type === 'UserLeftEvent') {
            const { userId } = message;
            if (this.anotherUser?.userId === userId) {
                this.subscribeStream?.getTracks().forEach((track) => track.stop());
                this.subscriber?.close();
                this.subscriber = null;
                this.subscribeStream = null;
                this.subscribeStatus = Status.None;
                this.anotherUser = null;
            }
        }
    };

    _sendJoinMessage = flow(function* (this: RoomStore) {
        const request = { roomId: this.roomId };
        const response = yield this.client!.sendMessage(request, 'JoinRequest', true);

        if (response.type === 'JoinResponse') return response.message;
        if (response.type === 'ErrorResponse') throw new Error(`응답코드 (${response.message.errorCode})`);
        throw new Error('응답코드 (알 수 없는 응답)');
    });

    _reportPublishedChange = flow(function* (this: RoomStore, published: boolean) {
        const request = { published };
        yield this.client!.sendMessage(request, 'UserPublishedChangeReport', false);
    });
}