import { date } from "faker";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-1106
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
      await this.addPatientPage.waitForTimeout(1500);//Wait for the animation
    });

    this.addTestStep(`verify that patient is displayed on the top of the list `, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickCloseButton();
      await this.dashboardPage.waitForPatientList();
      let name = await this.dashboardPage.getNewPatientFromListName();
      expect(name).toBe(this.patientName);
    });


    this.addTestStep(`Refresh the page and verify that new patient get into the sorted patient list accordingly`, async () => {
      await this.tab.keyboard.press("F5");
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      let name = await this.dashboardPage.getFirstPatientFromListName();
      expect(name).not.toBe(this.patientName);
    });

    this.addTestStep(`Go to another page, return back and verify that new patient get into the sorted patient list accordingly`, async () => {
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
      await this.addPatientPage.clickCloseButton();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      let name = await this.dashboardPage.getFirstPatientFromListName();
      expect(name).not.toBe(this.patientName);
    });


  }
}
new TestCase('CC-1106', 'New patients added through CupCake are displayed on the top of the patient list');

