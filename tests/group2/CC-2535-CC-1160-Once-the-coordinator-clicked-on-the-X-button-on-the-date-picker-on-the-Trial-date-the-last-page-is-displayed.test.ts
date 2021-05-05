
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2535
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
      await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Go to 'TRIAL DATE' and click on the 'date' or "ADD" button and Select any date`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.patientDetailPage.clickTrailDateScheduleBtn();
      await this.patientDetailPage.waitForTrailDateDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`clicking on the 'X' button`, async () => {
      await this.patientDetailPage.clickCloseFromDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Verify that old set date or "ADD" button is displayed`, async () => {
      await this.patientDetailPage.waitForTrailDateLabel();
      await this.patientDetailPage.waitForTrailDateScheduleBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1160', `Once the coordinator clicked on the X button on the date picker on the Trial date, the last page is displayed`);