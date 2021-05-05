
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2575
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
    this.addTestStep(`Go to 'Medical clearance' and click on the 'date' or "ADD" button and Select any date`, async () => {
      await this.patientDetailPage.waitForMedicalClearanceLabel();
      await this.patientDetailPage.waitForMedicalClearanceAddBtn();
      await this.patientDetailPage.clickMedicalClearanceAddBtn();
      await this.patientDetailPage.waitForMedicalClearanceDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`clicking on the 'X' button and Verify that old set date or "ADD" button is displayed`, async () => {
      await this.patientDetailPage.clickCloseFromDatePicker();
      await this.patientDetailPage.waitForMedicalClearanceLabel();
      await this.patientDetailPage.waitForMedicalClearanceAddBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1161', `Once coordinator clicked on 'Cancel' button on date picker on Medical clearance, Patient detail screen is displayed`);