import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2566
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
    this.addTestStep(`Add data for some fields on the page`, async () => {
      await this.patientDetailPage.clickMRIAddBtn();
      await this.patientDetailPage.waitForMRIDatePicker();
      await this.patientDetailPage.clickSetFromDatePicker();
      await this.patientDetailPage.waitForMRIAddBtn();
      const mri = await this.patientDetailPage.getValueOfMRI();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(mri)).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Try to left the page by clicking on "X" button`, async () => {
      await this.patientDetailPage.clickClose();
      await this.patientDetailPage.waitForUnsaveWarningMessage();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1382', `If user doesn't hit Save button after changes on Patient Details page error that you have unsaved changes should be shown`);
