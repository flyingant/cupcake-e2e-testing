import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2378
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
    this.addTestStep(`Verify if Add "+" button is present in Psych information column,  if no psych eval date is set`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test008')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatient();
    });

    this.addTestStep(`Click on Add "+" button`, async () => {
      await this.dashboardPage.clickPSYIcon();
      await this.dashboardPage.waitForPSYPopUp();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-636', `Add + button is shown in Psych column, if no psych eval date is set`);
