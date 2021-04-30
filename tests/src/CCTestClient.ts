import { PlatformClient } from "./api-server/lib/PlatformClient";
import { PlatformService } from "./api-server/services";
import AppConf from "./AppConf";

export default class CCTestClient {
    accessToken: string;
    adminAccessToken: string;
    systemAccessToken: string;

    async init() {
        this.accessToken = await CCTestClient.accessToken();
        this.adminAccessToken = await CCTestClient.adminAccessToken();
        this.systemAccessToken = await CCTestClient.systemAccessToken();
    }

    static async retry(times: number, fn: ()=>Promise<any>) {
        for(let i=0; i<times+1; i++) {
            try {
                if(i>0)
                    process.stderr.write(`CCTestClient retry ${i+1}\n`)
                return await fn()
            } catch(exception) {
                if(i === times)
                    throw(exception)
            }
        }
    }

    static async accessToken() : Promise<string> {
        const token = await CCTestClient.retry(4, ()=> new PlatformService().getAuthToken(AppConf.userName(), AppConf.password()));
        return token.accessToken;
    }

    static async adminAccessToken() : Promise<string> {
        const token = await CCTestClient.retry(4, ()=> new PlatformService().getAuthToken(AppConf.ccAdminUserName(), AppConf.ccAdminPassword()));
        return token.accessToken;
    }

    static async systemAccessToken() : Promise<string> {
        const token = await CCTestClient.retry(4, ()=> PlatformService.getSystemAuthToken());
        return token.accessToken;
    }

    async addStaff(email: string, firstName: string, lastName: string) {
        const client = new PlatformClient(this.accessToken);
        const data = await client.post({
                url:AppConf.baseApiUrl() + "/api/clinic/staff",
                payload:{"email": email, "firstName": firstName, "lastName": lastName}
            });
        return data;
    }

    async platform_getEmailForAddress(email: string) {
        const client = new PlatformClient(this.systemAccessToken);
        const data = await client.get({
                url:AppConf.platformURL() + "/email-service/system/email-by-address",
                payload:{"email": email}
            });
        return data;
    }

    async setPoliciesAccept(username:string, password:string, accepted:boolean){
        const token = await CCTestClient.retry(4, ()=> new PlatformService().getAuthToken(username, password));
        const client = new PlatformClient(token.accessToken);
        const data = await client.patch({
            url:AppConf.baseApiUrl() + "/api/user",
            payload:{"policiesAccepted": accepted}
        });
        return data;
    }
}