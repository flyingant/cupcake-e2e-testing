import { readFileSync } from "fs";
import { Request } from "playwright";
import AbstractTestCase from "./AbstractTestCase";
import RequestResponse from "./RequestResponse";
import AppConf from "./AppConf";
import CCTestClient from "./CCTestClient";

export default abstract class MockableTestCase extends AbstractTestCase {
    private mockApiCalls: any[];

	constructor(id: string, title: string) {
        super(id, title);
	}

    protected setupNetworkInterceptor() {
        super.setupNetworkInterceptor();

        if(AppConf.shouldMockRequest()) {
            this.readMockApiCalls();
            this.tab.route(AppConf.baseApiUrl()+'/**', async (route, request) => {
                if(this.isApiRequest(request)) {
                    let mock = this.getMockedApiCall(request);
                    if(!mock) {
                        console.log("no mock data found for " + request.url() + " " + request.method());
                    }
                    const json = JSON.stringify(mock?.respJson);
                    const contentType = mock?.respHeaders!['content-type'];
                    route.fulfill({
                        status: 200,
                        headers: mock?.respHeaders,
                        contentType: contentType,
                        body: json
                    });
                } else {
                    route.continue();
                }
            });    
        }
    }

    private readMockApiCalls() {
        const json = readFileSync("./tests/mock/"+this.id+".json").toString();
        this.mockApiCalls = JSON.parse(json);
    }

    private getMockedApiCall(request: Request) : RequestResponse | null {
        const url: string = request.url();
        for(let apicall of this.mockApiCalls) {
            if(apicall.url == AppConf.apiRelativePath(url) && apicall.method == request.method()) {
                return apicall;
            }
        }
        return null;
    }
}