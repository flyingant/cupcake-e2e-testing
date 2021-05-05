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
    this.addTestStep(`Verify data color displaying for D2P`, async () => {
      await this.patientDetailPage.waitForD2P();
      const fontWeight = await this.patientDetailPage.getFontWeightOfD2P();
      expect(fontWeight).toBe("700");
    });
  }
}

new TestCase('CC-991', `Color rules for D2P on Patient Details page`);

