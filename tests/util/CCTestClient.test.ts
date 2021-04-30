import { PlatformService } from "../src/api-server/services";
import CCTestClient from "../src/CCTestClient";

let ccTestClient = new CCTestClient();

beforeAll(async () => {
    await ccTestClient.init()
})

describe("test util", () => {

    this.addTestStep("test oauth token", async () => {
        const user = await new PlatformService(ccTestClient.accessToken).getPlatformUser();
        console.log(JSON.stringify(user))
    })

    this.addTestStep("test admin oauth token", async () => {
        const user = await new PlatformService(ccTestClient.adminAccessToken).getPlatformUser();
        console.log(JSON.stringify(user))
    })

});