import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1757
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    this.addTestStep('Go to the stage drop-down list and click on the "All Stages,Click on the "Archived" option"', async () => {
      await this.dashboardPage.searchByStage("Archived");
      await this.tab.waitForSelector(this.dashboardPage.css_edu,{state:"attached"});
      let edus=await this.tab.$$(this.dashboardPage.css_edu);
      for (let edu of edus ){
      expect(await edu.isEnabled()).toBe(false);
      }
    });

  }
}
new TestCase('CC-1757', 'Verification: CupCake portal user can see archived patients after choosing "Archived" in the stages drop-down list');

