import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2417
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
    this.addTestStep(`Go to Trial or Perm column and click on "Schedule" button`, async () => {
      await this.dashboardPage.searchByName(AppConf.getStablePatient('Test007')); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickTrialDateScheduleBtn()
      await this.dashboardPage.waitForDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Select next (or second) date after today`, async () => {
      await this.dashboardPage.clickSetFromDatePicker();
      await this.dashboardPage.waitForScheduleBtnFromWanringPopup();
      await this.dashboardPage.waitForCancelBtnFromWanringPopup();
    });

    this.addTestStep(`Click on "Cancel" button and verify the result`, async () => {
      await this.dashboardPage.clickCancelBtnFromWanringPopup();
      await this.dashboardPage.waitForPatientList();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1458', `Clicking on Cancel button should closes pop up Date must be at least two business days from today`);
