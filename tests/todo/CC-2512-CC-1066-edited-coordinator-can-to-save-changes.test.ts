import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1066
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
    this.addTestStep("set ImplantConsult date and save", async () => {
      await this.patientDetailPage.setImplantConsult();
      await this.patientDetailPage.clickSaveChange();
      await this.dashboardPage.waitForToast("Patient updated successfully")
    });
  
  }
}
new TestCase('CC-1066', 'Verification: Once Patient implant consult date is added/edited coordinator can');

