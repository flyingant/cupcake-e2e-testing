import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2381
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
    this.addTestStep(`Navigate to the TRIAL date column and click on date piker`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test007')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickTrialDateScheduleBtn()
      await this.dashboardPage.waitForDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Click "X" cancel option and verify the result`, async () => {
      await this.dashboardPage.clickCloseFromDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
      await this.dashboardPage.waitForPatient();
    });
  }
}

new TestCase('CC-720', `Coordinator can cancel out of the date picker and close popup. `);
