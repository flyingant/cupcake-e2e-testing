import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2441
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Login to Cupcake portal as a clinic coordinator and Navigate to 'All SCS patients' list`, async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });
    this.addTestStep(`Verify if Implanted patients are shown by a separate number`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.waitForPatient();
      await this.dashboardPage.waitForTotalImplants();
    });
  }
}

new TestCase('CC-589', `Implanted patients are shown by a separate number on pipeline and in the table near to the metrics`);
