import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-871
class TestCase extends MockableTestCase {
  gender: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep("Click on any name of patient from 'All SCS Patients' list", async () => {
      // go to patient detail
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Make any changes', async () => {
      this.gender = await this.patientDetailPage.getSelectedGender();
      if (this.gender == "female"){
        await this.patientDetailPage.setGenderMale();
      }else{
        await this.patientDetailPage.setGenderFemale();
      }
    });

    this.addTestStep("Click on 'X' button", async () => {
      await this.patientDetailPage.clickHeaderX();
      await this.patientDetailPage.waitForToast("You have changed or entered information on this page")
    });

    this.addTestStep("click 'DISCARD CHANGES'", async () => {
      await this.patientDetailPage.clickDiscardChanges();
      await this.dashboardPage.waitForMe();
    });
  }
}
new TestCase('CC-871', "Verification: Once the coordinator clicked on the 'YES, CANCEL' option, the dashboard screen is displayed");

