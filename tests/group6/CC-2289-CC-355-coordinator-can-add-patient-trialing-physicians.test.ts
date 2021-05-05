import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-335
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;
  trialDate: string;

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

    this.addTestStep('Fill in all required fields and navigate to patient’s SCS trial date screen', async () => {
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();


      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      this.trialDate = await this.addPatientPage.getTrialDate();
    });

    this.addTestStep('In "Physician" drop down list select clinic physician', async () => {
      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();
    });


    this.addTestStep("Click on next '->' button to summary data is saved", async () => {
      await this.addPatientPage.waitForSummaryPage();      
      let summaryTrailDate = await this.addPatientPage.getSummaryTrialDate();
      expect(this.trialDate).toBe(summaryTrailDate);
    });
  }
}
new TestCase('CC-335', 'Verification: Coordinator can add patient’s Trialing physicians');

