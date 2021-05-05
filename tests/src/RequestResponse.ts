import { Serializable } from "child_process";
import { Request } from "playwright";
import AppConf from "./AppConf";

export default class RequestResponse {
    url: string;
    method: string;
    reqHeaders: { [key: string]: string; };
    reqData: object | null;
    statusCode: number | undefined;
    respHeaders: { [key: string]: string; } | undefined;
    respData: Buffer | undefined;
    respJson: Serializable | undefined;
    startTime: number = 0;
    endTime: number = 0;
    duration: number = 0;
    errorText: string | undefined;
    curl: string | undefined;

    static async create(req: Request) : Promise<RequestResponse> {
        const call: RequestResponse = new RequestResponse();
        call.url = req.url().substring(AppConf.baseApiUrl().length);
        call.method = req.method();
        call.reqHeaders = req.headers();
        call.reqData = req.postDataJSON();
        if(req.failure()) {
            call.errorText = req.failure()?.errorText;
        } else {
            try {
                let resp = await req.response();
                call.statusCode = resp?.status();
                call.respHeaders = resp?.headers();
                if(call.respHeaders && call.respHeaders['content-type'] == 'application/json') {
                    try {
                        call.respJson = await resp?.json();
                    } catch(err){
                        call.respData = await resp?.body();
                    };
                } else {
                    call.respData = await resp?.body();
                }
                call.startTime = Math.floor(req.timing().startTime);
                call.duration = Math.floor(req.timing().responseEnd);
            } catch (e) {
                // 
            }
        }
        call.curl = RequestResponse.getCurlCommand(call);

        let date = new Date();
        date.setTime(call.startTime);
        process.stdout.write(`${date.toLocaleString()}  ${call.url}  ${call.method} duration: ${call.duration}\n`)
        return call;
    }

    static getCurlCommand(call: RequestResponse) : string {
        let cmd = 'curl';

        cmd += " " + call.reqHeaders[':scheme'] + "://" + call.reqHeaders[':authority'] + call.url;
 
        cmd += ' -X ' + call.method;

        if(call.reqHeaders['accept']) {
            cmd += " -H 'accept:" + call.reqHeaders['accept'] + "'";
        }

        if(call.reqHeaders['authorization']) {
            cmd += " -H 'authorization:" + call.reqHeaders['authorization'] + "'";
        }
 
        if(call.reqHeaders['content-type']) {
            cmd += " -H 'content-type:" + call.reqHeaders['content-type'] + "'";
        }

        if(call.reqData) {
            let re = /'/gi
            cmd += " -d '" + JSON.stringify(call.reqData).replace(re, "\\'") + "'";
        }

        return cmd;
    }
}