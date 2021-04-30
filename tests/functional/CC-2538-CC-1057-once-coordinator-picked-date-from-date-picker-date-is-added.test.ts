import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2538
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
    });
    this.addTestStep(`Select any of date and Verify that date is added after clicking on 'Schedule' button`, async () => {
      await this.patientDetailPage.clickSetFromDatePicker();
      const mri = await this.patientDetailPage.getValueOfMRI();
      const regex = new RegExp('^(1[0-2]|0[1-9])/(3[01]|[12][0-9]|0[1-9])/[0-9]{4}$')
      expect(regex.test(mri)).toBe(true);
    });
  }
}

new TestCase('CC-1057', `Once coordinator picked date from date picker, date is added `);
