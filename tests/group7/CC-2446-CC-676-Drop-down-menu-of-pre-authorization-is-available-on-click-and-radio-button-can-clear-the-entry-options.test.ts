import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2446
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
    this.addTestStep(`Navigate to 'AUTH.' column, verify if drop down menu of pre authorization is available on click`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test006')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickAuthIcon();
      await this.dashboardPage.waitForAUTHPopUp();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Click on drop down menu and verify the option in drop dowm`, async () => {
      await this.dashboardPage.clickClearEntry();
      await this.dashboardPage.waitForPatientList();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-676', `Drop down menu of pre authorization is available on click, and radio button can clear the entry/options`);
