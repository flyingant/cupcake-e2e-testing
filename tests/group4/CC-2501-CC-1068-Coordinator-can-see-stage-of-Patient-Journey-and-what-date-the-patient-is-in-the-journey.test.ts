import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-1068
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
    this.addTestStep(
      "Check if stage of 'Patient Journey' and what date the patient is in the journey is displayed",
      async () => {
        // no need wait for created date, stage will show with it at same time
        await this.patientDetailPage.waitForPatientStage();
        const state = await this.patientDetailPage.getStage();
        const date = await this.patientDetailPage.getCreatedDate();
        expect(state).not.toBe("");
        expect(date).not.toBe("");
      }
    );
  }
}
new TestCase(
  "CC-1068",
  "Verification: Coordinator can see stage of 'Patient Journey' and what date the patient is in the journey"
);
