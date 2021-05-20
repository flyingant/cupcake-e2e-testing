import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2435
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;
  totalNumber: Number;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      this.totalNumber = Number(await this.dashboardPage.getScsPatientsCount());
    });

    this.addTestStep(`Navigate to 'All SCS patients' list`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });

    this.addTestStep('Click on the "ADD PATIENT" button, fill in all needed fields and submit', async () => {
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();
      await this.addPatientPage.waitForSummaryPage();  
    });

    this.addTestStep('Return to the Home page and verify if number of patients is changed', async () => {    
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
      const totalSCSPatientsNumber = Number(await this.dashboardPage.getScsPatientsCount());
      expect(this.totalNumber === totalSCSPatientsNumber - 1).toBe(true);
    });
  }
}
new TestCase('CC-697', 'Each time the coordinator adds a patient in CupCake total number of patients should changed');

