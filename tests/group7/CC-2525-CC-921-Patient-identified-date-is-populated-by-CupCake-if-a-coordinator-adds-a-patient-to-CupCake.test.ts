import { date } from "faker";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-921
class TestCase extends MockableTestCase {
  patient: Map<string, string>;
  patientName: string;
  identificationDate :string;
  
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
      this.identificationDate = await this.addPatientPage.getIdentificationDate();
      await this.addPatientPage.selectStage("In Trial");
      await this.addPatientPage.clickNextButton();

      await this.addPatientPage.selectPhysician({ index: 0 });
      await this.addPatientPage.clickNextButton();
      // summaryPage click add button
      await this.addPatientPage.waitForSummaryPage();
      await this.addPatientPage.clickAddPatientButton();
      await this.dashboardPage.waitForMe();
    });
    

    this.addTestStep(`Select newly added patient and open patient details page `, async () => {
      await this.dashboardPage.searchByName(this.patientName);
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.selectFirstPatientFromList();
      await this.patientDetailPage.waitForMe();
    });


    this.addTestStep(`Verify if Patient identified date is populated and consist to date when patient was added`, async () => {
      let date = await this.patientDetailPage.getCreatedDate();
      expect(date.valueOf()).toBe(this.identificationDate);
    });


  }
}
new TestCase('CC-921', 'Patient identified date is used to calculate D2T for patients');

