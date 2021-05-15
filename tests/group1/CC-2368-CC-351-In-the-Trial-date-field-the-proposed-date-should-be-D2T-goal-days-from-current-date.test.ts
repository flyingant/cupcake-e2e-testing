import { formatDistanceToNowStrict } from "date-fns";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2368
class TestCase extends MockableTestCase {
  patient: Map<string, string>;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );
    this.addTestStep(`Click 'ADD PATIENT' button`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickAddPatientButton();
      await this.addPatientPage.waitForMe();
    });
    this.addTestStep(
      "Fill in all required fields on Add patient details page and click next '->' button",
      async () => {
        this.patient = this.addPatientPage.generatePatientData();
        await this.addPatientPage.setPatientDetail(this.patient);
        await this.addPatientPage.clickNextButton();

        await this.addPatientPage.selectStage("In Trial");
        await this.addPatientPage.clickNextButton();
      }
    );
    this.addTestStep("Verify date in 'TRIAL DATE' field", async () => {
      const trialDate = await this.addPatientPage.getTrialDate();
      const distance = formatDistanceToNowStrict(new Date(trialDate), {
        unit: "day",
      });
      const distanceNumber = parseInt(distance.split(" ")[0]);
      expect(distanceNumber >= 50).toBeTruthy();
    });
  }
}

new TestCase(
  "CC-351",
  "Verification: In the 'Trial date' field the proposed date should be D2T goal days from current date."
);
