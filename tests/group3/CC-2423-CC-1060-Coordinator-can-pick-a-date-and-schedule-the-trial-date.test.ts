import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2423
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    const randomString = Math.random().toString(36).substring(7);
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(`Navigate to the TRIAL column, select patient which hasn't trial date setted up`, async () => {
      await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Click on “SCHEDULE" button.`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
    });
    
    this.addTestStep(`Select a date and schedule the trial date`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.clickScheduleBtnFromWanringPopup();
      await this.patientDetailPage.clickSaveChange();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Click on the "SAVE" button.`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });

    this.addTestStep(`Open datepicker in another patient row and click on the "X" cancel button`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    
  }
}

new TestCase('CC-1060', `Coordinator can pick a date and schedule the trial date`);
