import SockJS from "sockjs-client";
import { Stomp, CompatClient, type messageCallbackType } from "@stomp/stompjs";

const stompClient = ref<CompatClient>();
const isConnected = ref(false);

export function useSocket() {
    const connect = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const socket = new SockJS(`http://localhost:8080/ws`);
            stompClient.value = Stomp.over(socket);
            stompClient.value?.connect(
                {},
                () => {
                    console.log('Connected');
                    isConnected.value = true;
                    resolve();
                },
                (error: any) => {
                    connect();
                }
            );
        });
    }

    const subscribe = (link: string, func: messageCallbackType) => {
        if (isConnected.value) {
            stompClient.value?.subscribe(link, func);
        }else{
            connect();
        }
    }

    const unsubscribe = (link: string) => {
        if (isConnected.value) {
            stompClient.value?.unsubscribe(link);
        }else{
            connect();
        }
    }

    return {
        connect,
        subscribe,
        unsubscribe
    };
}