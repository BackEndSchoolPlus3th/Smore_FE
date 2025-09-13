import SockJS from 'sockjs-client';
import { Client,IMessage } from '@stomp/stompjs';

import { use, useEffect,useRef } from 'react';
import { useStore } from '../../features/videoChat/stores/StoreContext';

const WebSocketTest = () => {
    const clientRef = useRef<Client | null>(null);
    const { roomStore } = useStore();


    useEffect(() => {
        const raw = localStorage.getItem('accessToken')||'';
        if(!raw) {console.log('no token'); return;}


        const socket = new SockJS(
            `http://localhost:8090/webmedia-ws`,
        );

        const stompClient = new Client({
            webSocketFactory: () => socket as any,
            connectHeaders: {
                Authorization: `Bearer ${raw}`,
            },
            debug: (str) => {
                console.log(str);
            }  
        });

        stompClient.onConnect = () => {
            console.log('WebSocket connected');
        

        stompClient.subscribe('/topic/vc/1', (msg: IMessage) => {
        console.log('📩 recv:', msg.body);
        });

        stompClient.publish({
            destination: '/app/vc/1',
            body: JSON.stringify({ 
                messageId: '01',
                roomId: '1',
                userId: '1',
                sentAt: new Date().toISOString(),
                type: 'joinRequestPayload',
                payload: { 

                 }
            }),
        });
        };
        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
            clientRef.current = null;
        };

    }, []);
    return <div>WebSocketTest</div>;

};
export default WebSocketTest;