import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-908
class TestCase extends MockableTestCase {
  fullname: string
  physicianList: string[]

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Click on any patient name on dashboard", async () => {
      let fullname = await this.tab.innerText(this.dashboardPage.css_patientFullName);
      await this.dashboardPage.searchByName(fullname);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickPatientName();
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

