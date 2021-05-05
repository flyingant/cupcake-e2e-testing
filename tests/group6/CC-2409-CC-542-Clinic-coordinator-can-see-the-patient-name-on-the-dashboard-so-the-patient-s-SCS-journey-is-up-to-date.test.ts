import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2409
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Verify if patients names are displayed`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatient();
      await this.dashboardPage.waitForPatientFullName();
    });
  }
}

new TestCase('CC-542', `Clinic coordinator can see the patient name on the dashboard so the patient’s SCS journey is up-to-date`);
