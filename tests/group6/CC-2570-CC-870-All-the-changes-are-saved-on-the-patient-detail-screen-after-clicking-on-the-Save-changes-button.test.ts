import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2570
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
    this.addTestStep(`Select any patient and open Patient details page`, async () => {
      await this.dashboardPage.searchByName('Test006'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep(`Make any changes`, async () => {
      await this.patientDetailPage.fillPatentName(`Test006 ${randomString}`)
      await this.patientDetailPage.clickEducationAddBtn();
      await this.patientDetailPage.waitForEducationPopUp();
      await this.patientDetailPage.clickClearEntry()

    });
    this.addTestStep(`Verify that after clicking on "SAVE CHANGES" button, new or edited data is displayed`, async () => {
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.searchByName('Test006'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
      await this.tab.waitForSelector(`input[value='Test006 ${randomString}']`);
    });
  }
}

new TestCase('CC-870', `All the changes are saved on the patient detail screen after clicking on the 'Save changes' button`);
