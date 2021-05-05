import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2415
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Enter any NOT valid name and click on search glass icon"`, async () => {
      await this.dashboardPage.searchByName('NO-POSSIBLE-TO-MATCH-ANY-NAMES'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForEmptySearchResultsMessage();
    });
    this.addTestStep(`click on the "Expand search`, async () => {
      await this.dashboardPage.clickExpandSearchBtn();
      await this.dashboardPage.waitForNoResultsMessage();
    });
  }
}

new TestCase('CC-706', `Error screen is displayed if no results on searching for patients`);
