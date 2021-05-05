import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-384
class TestCase extends MockableTestCase {
  patient : Map<string, string>;
  patientName: string;
  identifiacationDate: string;
  trialDate: string;
  birthDay: string;
  phone: string;
  physicianName: string;

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
      this.birthDay = await this.addPatientPage.getDateOfBirth();
      this.phone = await this.addPatientPage.getPhone();
      await this.addPatientPage.clickNextButton();

      this.identifiacationDate = await this.addPatientPage.getIdentificationDate();
      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();
      this.trialDate = await this.addPatientPage.getTrialDate();
      this.physicianName = await this.addPatientPage.selectPhysician({index: 0});
      await this.addPatientPage.clickNextButton();
    });

    this.addTestStep('Navigate to Summary page and verify if all previously entered data is displayed', async () => {
      await this.addPatientPage.waitForSummaryPage();      
      expect((await this.addPatientPage.getSummaryName()).toLowerCase()).toBe(this.patientName.toLowerCase());
      expect(await this.addPatientPage.getSummaryTrialDate()).toBe(this.trialDate);
      expect(await this.addPatientPage.getSummaryDateOfBirth()).toBe(this.birthDay);
      expect((await this.addPatientPage.getSummaryGender()).toLowerCase()).toBe(this.patient.get("gender"))
      expect((await this.addPatientPage.getSummaryStage()).toLowerCase()).toBe("in trial");
      expect(await this.addPatientPage.waitForText(this.phone));
      expect(await this.addPatientPage.waitForText(this.physicianName));
    });
  }
}
new TestCase('CC-384', 'Verification: Coordinator can see the summary of the patient details added');

