class NetworkCallRequest {
    method!: string;    
    url!: string;
}

class NetworkCallResponse {
    status: bigint | undefined;
}

class NetworkCall {
    req: NetworkCallRequest | undefined;
    resp: NetworkCallResponse | undefined;
}