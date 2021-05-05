
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2555
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
    this.addTestStep(`Go to 'MEDICAL CLEARANCE' section and click on 'ADD' button`, async () => {
      await this.patientDetailPage.waitForMedicalClearanceLabel();
      await this.patientDetailPage.waitForMedicalClearanceAddBtn();
      await this.patientDetailPage.clickMedicalClearanceAddBtn();
      await this.patientDetailPage.waitForMedicalClearanceDatePicker();
    });
    this.addTestStep(`Select any date `, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      const medical_clearance = await this.patientDetailPage.getValueOfMedicalClearance();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(medical_clearance)).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`clicking on the 'X' button`, async () => {
      await this.patientDetailPage.clickMedicalClearanceAddBtn();
      await this.patientDetailPage.waitForMedicalClearanceDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Verify that datepicker disappears after clicking on the 'X' button`, async () => {
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.clickMedicalClearanceAddBtn();
      await this.patientDetailPage.waitForMedicalClearanceDatePicker();
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.waitForMedicalClearanceLabel();
      await this.patientDetailPage.waitForMedicalClearanceAddBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-967', `The coordinator can cancel out the date of the picker`);