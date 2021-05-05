import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2539
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
    this.addTestStep('Go to INSURANCE section and click on "ADD" button', async () => {
      await this.patientDetailPage.clickInsuranceAddBtn();
      await this.patientDetailPage.waitForInsuranceListPopUp();
    });
    this.addTestStep(`Verify that the list of suggested of insurance is displayed after entering 3 characters on the search field`, async () => {
      await this.patientDetailPage.fillInsurancePopUpInput('BCB');
      await this.patientDetailPage.waitForInsuranceList();
      const results = await this.tab.innerHTML('#insurance-popup li');
      expect(results.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-885', 'The coordinator is gotten suggestions of insurance after entering 3 characters on the popup search field');

