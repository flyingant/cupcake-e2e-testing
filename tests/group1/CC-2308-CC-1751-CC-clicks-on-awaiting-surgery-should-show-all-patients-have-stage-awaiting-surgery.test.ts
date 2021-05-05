import { resourceLimits } from "node:worker_threads";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1751
class TestCase extends MockableTestCase {
    patient: Map<string, string>;
    patientName: string;
    trialDate: string;

    createTestSteps(): void {
        this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
            await this.homePage.start();
            await this.loginPage.setEmailPasswordAndThenSubmit();
            await this.dashboardPage.waitForMe();
        });

        this.addTestStep('Click on the icon for awaiting surgery patients and verify if all displayed patients not have a trial date set', async () => {
            await this.dashboardPage.clickPiplineAwaitingSurgery();
            await this.tab.waitForSelector(this.dashboardPage.css_trial_awaitingSurgery,{state:"attached"})
            let dates=await this.tab.$$(this.dashboardPage.css_trial_awaitingSurgery);
            expect(dates).not.toBe([]);
        });
        this.addTestStep('Verify that all these patients are divided on:a.Awaiting implant b.Awaiting revision c.Awaiting explant', async () => {
            await this.tab.waitForSelector(this.dashboardPage.css_stage,{state:"attached"})
            let stages = await this.tab.$$(this.dashboardPage.css_stage);
            for (let stage of stages) {
                let text = await stage.innerText();
                expect(["scheduled implant", "scheduled revision", "scheduled explant"]).toContain(text.toLowerCase());
            }
        });

    }
}
new TestCase('CC-1751', 'Verification: CupCake portal user can see archived patients after choosing "Archived" in the stages drop-down list');

