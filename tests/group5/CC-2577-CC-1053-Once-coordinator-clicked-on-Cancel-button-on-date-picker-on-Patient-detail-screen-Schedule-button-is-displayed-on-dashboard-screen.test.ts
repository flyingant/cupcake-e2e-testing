import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2577
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    const randomString = Math.random().toString(36).substring(7);
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list and select a patient`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test004'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Go to "SURGERY DATE" and click on 'Schedule' button`, async () => {
      await this.patientDetailPage.waitForSurgeryDateLabel();
      await this.patientDetailPage.waitForSurgeryDateScheduleBtn();
      await this.patientDetailPage.clickSurgeryDateScheduleBtn();
      await this.patientDetailPage.waitForSurgeryDateDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Select any of date and click on 'Cancel' button`, async () => {
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.waitForSurgeryDateLabel();
      await this.patientDetailPage.waitForSurgeryDateScheduleBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    
    this.addTestStep(`Go to dashboard and verify that for patient selected on 2 step no "SURGERY DATE" is set`, async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test004'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPERMDateScheduleBtn();
    });
  }
}

new TestCase('CC-1053', `Once coordinator clicked on 'Cancel' button on date picker on Patient detail screen, 'Schedule' button is displayed on dashboard screen`);
