import MockableTestCase from "../src/MockableTestCase";
import { format } from "date-fns";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2356
class TestCase extends MockableTestCase {

  patient: Map<string, string>;

  patientName: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Dashboard Page and Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    
    this.addTestStep(
      "Fill in all required fields and navigate to SCS Stage page",
      async () => {
        await this.addPatientPage.waitForPatientDetailsPage();
        this.patient = this.addPatientPage.generatePatientData();
        this.patientName =
          this.patient.get("firstName") + " " + this.patient.get("lastName");
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();
      }
    );

    this.addTestStep(
      `Verify 'IDENTIFICATION DATE' field and check if date is correctly pre-filled`,
      async () => {
        await this.addPatientPage.waitForSCSJourneyPage();
        const value = await this.addPatientPage.getIdentificationDate();
        const today = format(new Date(), "MM/dd/yyyy");
        expect(today === value).toBe(true);
      } 
    );
  }
}

new TestCase(
  "CC-948",
  `Identification Date view should be pre-filled with today's date.`
);