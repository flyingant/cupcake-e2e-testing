import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2506
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
    this.addTestStep(`Go to MRI and click on 'Add' button`, async () => {
      await this.patientDetailPage.waitForMRILabel();
      await this.patientDetailPage.waitForMRIAddBtn();
      await this.patientDetailPage.clickMRIAddBtn();
      await this.patientDetailPage.waitForMRIDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Select any of date`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      const mri = await this.patientDetailPage.getValueOfMRI();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(mri)).toBe(true);
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Verify that Patient detail screen is displayed after clicking on 'Clear' button`, async () => {
      await this.patientDetailPage.clickMRIAddBtn();
      await this.patientDetailPage.waitForMRIDatePicker();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
    this.addTestStep(`Verify that old set date or 'Add' button is displayed on MRI`, async () => {
      await this.patientDetailPage.clickClearFromDatePicker();
      await this.patientDetailPage.waitForMRIAddBtn();
      await this.tab.waitForTimeout(1000); // waiting for 1s for better screen shot because of the aniamtion transisiton
    });
  }
}

new TestCase('CC-1059', `Once coordinator clicked on 'Clear' button on date picker , Patient detail screen is displayed `);
