import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2375
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
    this.addTestStep(`Select any patient and open Patient details page`, async () => {
      await this.dashboardPage.searchByName('Test008'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Go to Trial or Perm column and click on "Schedule" button`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Select next (or second) date after today`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.waitForWarningCard();
      await this.patientDetailPage.waitForScheduleBtnFromWanringPopup();
      await this.patientDetailPage.waitForCancelBtnFromWanringPopup();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton    
    });
  }
}

new TestCase('CC-1457', `If the user tries to change/set the trial/implant date to less than 2 business days, validation popup should be displayed`);
