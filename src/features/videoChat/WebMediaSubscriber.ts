interface WebMediaSubscriberType {
  pc: RTCPeerConnection | null;
  stream: MediaStream;
  apiUrl: string;
  streamUrl: string;
  subscribe: (appId: string, feedId: string) => Promise<any>;
  close: () => void;
}


export function WebMediaSubscriber(apiUrl: string, streamUrl: string): WebMediaSubscriberType {
  const self = {} as WebMediaSubscriberType;

  self.pc = new RTCPeerConnection();
  self.stream = new MediaStream();
  self.apiUrl = apiUrl;
  self.streamUrl = streamUrl;

  self.subscribe = async (appId: string, feedId: string): Promise<any> => {
    if (self.pc) {
      self.pc.addTransceiver('audio', { direction: 'recvonly' });
      self.pc.addTransceiver('video', { direction: 'recvonly' });

      const offer = await self.pc.createOffer();
      await self.pc.setLocalDescription(offer);

      const session = await new Promise<any>((resolve, reject) => {
        const fullApiUrl = `${self.apiUrl}/rtc/v1/play/`;
        const fullStreamUrl = `${self.streamUrl}/${appId}/${feedId}`;
        const transactionId = Number(
          parseInt((new Date().getTime() * Math.random() * 100).toString())
        )
          .toString(16)
          .slice(0, 7);

        const data = {
          api: fullApiUrl,
          streamurl: fullStreamUrl,
          tid: transactionId,
          clientip: null,
          sdp: offer.sdp,
        };

        console.log('Generated offer : ', data);

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          if (xhr.readyState !== xhr.DONE) return;
          if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);

          const answer = JSON.parse(xhr.responseText);
          console.log('Got answer : ', answer);
          return answer.code ? reject(xhr) : resolve(answer);
        };
        xhr.open('POST', fullApiUrl, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(data));
      });

      await self.pc.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
      );

      return session;
    } else {
      throw new Error('RTCPeerConnection이 없음');
    }
  };

  self.close = () => {
    if (self.pc) {
      self.pc.close();
    }
    self.pc = null;
  };


  self.pc.onconnectionstatechange = () => {
    const state = self.pc?.connectionState;
    console.log('RTCPeerConnection state changed ', state);
  };

  self.pc.ontrack = (event: RTCTrackEvent) => {
    console.log('RTCPeerConnection onTrack', event);

    if (event.track) {
      self.stream.addTrack(event.track);
    }
  };

  return self;
}
