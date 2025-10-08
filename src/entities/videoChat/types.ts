export type BaseMsg = {
    messageId: string;
    roomId: string;
    userId: string;
    sentAt: string;
};

export type JoinRequestPayload = BaseMsg & {
    type: 'joinRequestPayload';
    payload: {};
};

export type PublishReportPayload = BaseMsg & {
    type: 'publishReportPayload';
    payload: {
        published: boolean;
    };
};

export type LeaveRequestPayload = BaseMsg & {
    type: 'leaveRequestPayload';
    payload: Record<string, never>; // 빈 객체만 허용
};

export type VcOutbound =
  | JoinRequestPayload
  | PublishReportPayload
  | LeaveRequestPayload;

export type VcInbound =
  | ({
      type: 'errorResponsePayload';
    } & BaseMsg & {
      payload: { errorCode: string; message: string };
    })
  | ({
      type: 'joinEventPayload';
    } & BaseMsg & {
      payload: Record<string, never>; // 빈 페이로드 강제
    })
  | ({
      type: 'joinResponsePayload';
    } & BaseMsg & {
      payload: { apiUrl: string; streamUrl: string; userId: string };
    })
  | ({
      type: 'publishEventPayload'; 
    } & BaseMsg & {
      payload: { published: boolean };
    });
