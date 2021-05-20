import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-730
class TestCase extends MockableTestCase {

  createTestSteps(): void {

    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });

    this.addTestStep(`Navigate to 'All SCS patients' list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });

    this.addTestStep(`Click on Patient stage column and verify the result`, async () => {
      await this.dashboardPage.clickAllStages();
      await this.dashboardPage.waitForAllStages();
      await this.dashboardPage.waitForText("Candidates");
      await this.dashboardPage.waitForText("Awaiting Trial");
      await this.dashboardPage.waitForText("In Trial");
      await this.dashboardPage.waitForText("Awaiting Surgery");
      await this.dashboardPage.waitForText("Implanted");
      await this.dashboardPage.waitForText("Explanted");
      await this.dashboardPage.waitForText("Archived");
    });

    this.addTestStep(`verify the result 1`, async () => {
      await this.dashboardPage.waitForHoverAwaitingTrial();
      await this.dashboardPage.waitForText("All Awaiting Trial");
      await this.dashboardPage.waitForText("Unscheduled");
      await this.dashboardPage.waitForText("Scheduled");
    });

    this.addTestStep(`verify the result 2`, async () => {
      await this.dashboardPage.waitForHoverAwaitingSurgery();
      await this.dashboardPage.waitForText("All Awaiting Surgery");
      await this.dashboardPage.waitForText("Unscheduled");
      await this.dashboardPage.waitForText("Scheduled");
    });


    
  }
}

new TestCase('CC-730', `Patient stage column can be sorted by the stage`);
