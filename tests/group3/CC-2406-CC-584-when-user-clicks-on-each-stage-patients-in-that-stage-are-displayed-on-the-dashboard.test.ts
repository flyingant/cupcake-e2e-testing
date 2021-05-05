import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-584
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Click stage by stage and verify if patients in that stage are displayed on dashboard', async () => {
      await this.dashboardPage.clickPiplineAwaitingSurgery();
      let patients_1 = await this.tab.$$(this.dashboardPage.css_stage);
      for (let element of patients_1) {
        let stage = await element.innerText();
        expect(['scheduled implant', 'awaiting implant']).toContain(stage.toLowerCase());
      };

      await this.dashboardPage.clickPiplineCandidates();
      let patients_2 = await this.tab.$$(this.dashboardPage.css_stage);
      for (let element of patients_2) {
        let stage = await element.innerText();
        expect('candidate').toBe(stage.toLowerCase());
      };

      await this.dashboardPage.clickPiplineAwaitingTrial();
      let patients_3 = await this.tab.$$(this.dashboardPage.css_stage);
      for (let element of patients_3) {
        let stage = await element.innerText();
        expect(['awaiting trial', 'scheduled trial']).toContain(stage.toLowerCase());
      };

      await this.dashboardPage.clickPiplineInTrial();
      let patients_4 = await this.tab.$$(this.dashboardPage.css_stage);
      for (let element of patients_4) {
        let stage = await element.innerText();
        expect('in trial').toBe(stage.toLowerCase());
      };
    });
  }
}
new TestCase('CC-584', 'Verification: SCS pipeline is clickable by stage and when user clicks on each stage, patients in that stage are displayed on the dashboard');

