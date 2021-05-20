import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-908
class TestCase extends MockableTestCase {
  physicianList: string[]

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
    });

    this.addTestStep("Click on any patient name on dashboard", async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.searchByName('Test008'); // in order to get the clean UI, use the stable data instead
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Navigate to the "Stage" field and verify if one of the 12 stages is shown', async () => {
      let stage = await this.patientDetailPage.getStage();
      expect(stage).not.toBe(undefined)
    });

    this.addTestStep('Try to select some stage and set', async () => {
      let edit = await this.tab.isEditable(this.patientDetailPage.css_stage)
      expect(edit).toBe(false)
    });
  }
}
new TestCase('CC-908', "Verification: Patient Stage for a patient shows one of 12 stages and can't be changed by the coordinator");

