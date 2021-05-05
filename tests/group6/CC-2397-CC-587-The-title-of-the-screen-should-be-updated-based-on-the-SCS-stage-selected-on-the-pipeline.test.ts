import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2397
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPipeline();
    });
    this.addTestStep(`Click on any stage on pipeline and verify if title of screen is updated`, async () => {
      await this.dashboardPage.clickCandidatesFromPipeline();
      await this.dashboardPage.waitForCandidatesTitle();
    });
  }
}

new TestCase('CC-587', `The title of the screen should be updated based on the SCS stage selected on the pipeline`);
