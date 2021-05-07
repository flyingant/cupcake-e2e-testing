import { getYear, parse, set, format } from "date-fns";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2338
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(
      `Click 'ADD PATIENT' button and Fill in all required fields with a valid data`,
      async () => {
        await this.dashboardPage.clickAddPatientButton();
        await this.addPatientPage.waitForMe();
        const patient = this.addPatientPage.generatePatientData();
        await this.addPatientPage.setPatientDetail(patient);
      }
    );
    this.addTestStep(
      "Go to next step and Verify 'IDENTIFICATION DATE' field and check if the date is correctly pre-filled and Choose any stage from the drop-down list",
      async () => {
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.selectStage("Awaiting/Scheduled Trial");
      }
    );
    this.addTestStep(
      "Navigate to the SCS trial or implant date and try to set a date less than the identification date",
      async () => {
        const identificationDateString = await this.addPatientPage.getIdentificationDate();
        const identificationDate = parse(
          identificationDateString,
          "MM/dd/yyyy",
          new Date()
        );
        const lastYear = getYear(identificationDate) - 1;
        const trialDate = format(
          set(identificationDate, { year: lastYear }),
          "MM/dd/yyyy"
        );
        await this.addPatientPage.clickNextButton();
        await this.addPatientPage.setTrialDate(trialDate);
        const error = await this.tab.innerText(".error-holder");
        expect(error).toBe("Please enter a valid date");
      }
    );
  }
}

new TestCase(
  "CC-950",
  "Trial date or implant date should not be allowed to be added to date less than the identification date."
);
