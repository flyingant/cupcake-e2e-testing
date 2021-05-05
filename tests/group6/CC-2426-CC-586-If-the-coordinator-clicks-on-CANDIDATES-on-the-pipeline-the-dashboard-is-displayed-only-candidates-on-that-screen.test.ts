import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2426
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Navigate to SCS pipeline`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPipeline();
    });
    this.addTestStep(`Click on “CANDIDATES” on pipeline and verify that only candidates are displayed on that screen.`, async () => {
      await this.dashboardPage.clickCandidatesFromPipeline();
      await this.dashboardPage.waitForCandidatesTitle();
    });
  }
}

new TestCase('CC-586', `If the coordinator clicks on “CANDIDATES” on the pipeline, the dashboard is displayed only candidates on that screen`);
