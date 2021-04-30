import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-458
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
      await this.addPatientPage.selectStage("Awaiting/Scheduled Implant");
      await this.addPatientPage.clickNextButton();
      let surgonDate = await this.addPatientPage.getSurgeryDate();
      await this.addPatientPage.selectSurgon({index: 0});
      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();
      await this.addPatientPage.waitForSummaryPage();
      let summarySurgeryDate = await this.addPatientPage.getSummarySurgeryDate();
      expect(summarySurgeryDate).toBe(surgonDate)
    });

    this.addTestStep('Click on the "ADD PATIENT" button', async () => {
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForText(this.patient.get("firstName") + " " + this.patient.get("lastName"));
    });
  }
}
new TestCase('CC-458', 'Verification: The coordinator can set the SCS surgeon date for the patient');

