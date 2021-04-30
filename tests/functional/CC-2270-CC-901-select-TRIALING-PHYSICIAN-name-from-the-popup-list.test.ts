import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-901
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Select any patient and open 'Patient details' page", async () => {
      await this.dashboardPage.hoverPatientName()
      await this.dashboardPage.clickViewDetails()
      await this.patientDetailPage.waitForMe();
    });
    this.addTestStep("select Physician", async () => {
      await this.patientDetailPage.selectPhysician({index: 0});
      await this.patientDetailPage.waitForText("Save Changes");
    });

  
  }
}
new TestCase('CC-901', 'Verification: The coordinator can select the "TRIALING PHYSICIAN" name from the popup list (ONLY CLINIC PHYSICIAN)');

