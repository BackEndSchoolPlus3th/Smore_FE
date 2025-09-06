import SockJS from 'sockjs-client';
import { Client,IMessage } from '@stomp/stompjs';

import { useEffect,useRef } from 'react';

const WebSocketTest = () => {
    const clientRef = useRef<Client | null>(null);



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
        

        stompClient.subscribe('/topic/test', (msg: IMessage) => {
        console.log('📩 recv:', msg.body);
        });

        stompClient.publish({
            destination: '/app/vc/test',
            body: JSON.stringify({ message: 'Hello, WebSocket!' }),
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