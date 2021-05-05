import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-352
class TestCase extends MockableTestCase {
  patient : Map<string, string>

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Click on the "ADD PATIENT" button', async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep('Fill in all required fields on Add patient details page and click to the "->" button', async () => {
      this.patient = this.addPatientPage.generatePatientData();
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();
    });
    
    this.addTestStep('On SCS trial date screen set SURGEON DATE and click to the "->" button', async () => {
      await this.addPatientPage.setTrialDate("12012004");
      await this.addPatientPage.waitForText("Please enter a valid date");
    });
  }
}
new TestCase('CC-352', "Verification: In 'TRIAL DATE' field can't be added past date");

