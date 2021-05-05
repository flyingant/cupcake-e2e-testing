import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

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
    this.addTestStep(`Verify if 'Add' button is present in Education section , if no education date is set`, async () => {
      await this.patientDetailPage.waitForEducationLabel();
      await this.patientDetailPage.waitForEducationAddBtn();
    });
    this.addTestStep(`Click on 'Add' button`, async () => {
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.waitForEducationPopUp();
    });
  }
}

new TestCase('CC-1019', `'Add' button is shown in Education section, if no education date is set on Patient detail screen`);
