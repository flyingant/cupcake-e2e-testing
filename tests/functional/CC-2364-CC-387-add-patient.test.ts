import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-387
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;

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

    this.addTestStep('Fill in all required fields on every page', async () => {
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();
    });

    this.addTestStep('Navigate to Summary page and click on the "ADD PATIENT" button', async () => {
      await this.addPatientPage.waitForSummaryPage();      
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
      // go to patient detail
      await this.dashboardPage.searchByName(this.patientName)
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickViewDetails();
      await this.patientDetailPage.waitForMe();
      // assert the added data
      expect((await this.patientDetailPage.getPatientName()).toLowerCase()).toBe(this.patientName.toLowerCase());
      expect(await this.patientDetailPage.getSelectedGender()).toBe(this.patient.get("gender"));
      expect(await this.patientDetailPage.getZipCode()).toBe(this.patient.get("zipCode"));
      expect(await this.patientDetailPage.getEmail()).toBe(this.patient.get("email"));
      expect(await this.patientDetailPage.getStage()).toBe("in trial");
    });
  }
}
new TestCase('CC-387', 'After clicking the "ADD PATIENT" button all previously entered data is saved and appropriate patient details are added to the dashboard');

