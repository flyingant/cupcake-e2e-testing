import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2520
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
    this.addTestStep(`Edit any information on patient detail screen`, async () => {
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.clickEducationBSCRepBtn();
    });
    this.addTestStep(`Verify that Message 'You have changed or entered information on this page' is shown when coordinator clicks  'X' button`, async () => {
      await this.patientDetailPage.clickClose();
      await this.patientDetailPage.waitForUnsaveWarningMessage();
    });
  }
}

new TestCase('CC-854', `Message 'You have changed or entered information on this page' is shown when coordinator doesn't hit 'Save changes' button`);
