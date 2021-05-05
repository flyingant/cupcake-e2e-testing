import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1448
class TestCase extends MockableTestCase {
  count: number;

  createTestSteps(): void {
    this.addTestStep('Login to Cupcake portal as a clinic coordinator', async () => {
      await this.homePage.start();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Verify the number of total implanted patients in pipeline', async () => {
      this.count = parseInt(await this.dashboardPage.getScsPatientsCount());
    });

    this.addTestStep('Add new patient via portal and verify the number of total implanted patients', async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
      let patient = this.addPatientPage.generatePatientData();
      await this.addPatientPage.setPatientDetail(patient);
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();

      // summaryPage click add button
      await this.addPatientPage.waitForSummaryPage();      
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
      let current_cont = parseInt(await this.dashboardPage.getScsPatientsCount());
      expect(current_cont).toBe(this.count + 1)
    });

    this.addTestStep('Update existing patient via portal and verify the number of All SCS Patients', async () => {
      await this.dashboardPage.hoverPatientName();
      await this.dashboardPage.clickPatientName();
      await this.patientDetailPage.waitForMe();
      await this.patientDetailPage.setNotes("set by cc-2484 for verify patient count");
      await this.patientDetailPage.clickSaveChange();
      let current_cont = parseInt(await this.dashboardPage.getScsPatientsCount());
      expect(current_cont).toBe(this.count + 1)
    });
  }
}
new TestCase('CC-1448', 'Verification: When a new patient is added the number of All SCS Patients should be updated properly.');

