
import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2529
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

    this.addTestStep(`Select the insureance section`, async () => {
      await this.patientDetailPage.clickInsuranceAddBtn();
      await this.patientDetailPage.waitForInsuranceListPopUp();
    });

    this.addTestStep(`Verify that selected insurance is displayed on patient detail screen after selecting any of insurance `, async () => {
      await this.patientDetailPage.fillInsurancePopUpInput('BCB');
      await this.patientDetailPage.waitForInsuranceList();
      await this.patientDetailPage.clickFirstItemFromInsuranceList();
      const value = await this.patientDetailPage.getValueOfInsurance()
      await expect(value.length > 0).toBe(true);
    });
  }
}

new TestCase('CC-881', 'Coordinator can select insurance from popup list');