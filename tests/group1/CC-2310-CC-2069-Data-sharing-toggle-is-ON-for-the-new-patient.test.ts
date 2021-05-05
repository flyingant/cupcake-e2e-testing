import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2069
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Click on the “+“ button and add a new patient.', async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
      this.patient = this.addPatientPage.generatePatientData();
      this.patientName = this.patient.get("firstName") + " " + this.patient.get("lastName");
      await this.addPatientPage.setPatientDetail(this.patient);
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();

      // summaryPage click add button
      await this.addPatientPage.waitForSummaryPage();      
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Navigate to the "patient detail" page of patient from step 2', async () => {
      await this.dashboardPage.searchByName(this.patientName);
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickPatientName();
      await this.patientDetailPage.waitForMe();
    });

    this.addTestStep('Verify if the "Data sharing" toggle is "ON"', async () => {
      let status = await this.tab.isChecked(this.patientDetailPage.css_DataSharing);
      expect(status).toBe(true);
    });
  }
}
new TestCase('CC-2069', 'Verification: "Data sharing" toggle is "ON" for the new patient that was created on CupCake portal');

