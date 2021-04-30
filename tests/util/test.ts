import CCTestClient from "../src/CCTestClient";

describe("test util", () => {
    let ccTestClient = new CCTestClient();

    this.addTestStep("add staff", async () => {
        const result = await ccTestClient.addStaff("kevin.zhang@bsci.com", 'KEVIN', 'ZHANG');
        console.log(JSON.stringify(result))
    })
});