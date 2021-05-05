import { format } from "date-fns";
import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";
import { getRandomBirthday } from "../util/getRandomBirthday";

// https://teamsolace.atlassian.net/browse/CC-2528
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    const randomDOB = format(getRandomBirthday(new Date("1992-01-01"), new Date("2002-01-01")), "MM/dd/yyyy");
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.fillEmailAndPasswordWithoutDelay(
          AppConf.getStableAccountUsername(),
          AppConf.getStableAccountPassword()
        );
      }
    );
    this.addTestStep(`Go to Patient list`, async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.waitForPatientList();
    });
    this.addTestStep(
      `Select any patient and open Patient details page`,
      async () => {
        await this.dashboardPage.searchByName("Test007"); // make sure patient exits and have identified
        await this.dashboardPage.waitForPatientList();
        await this.dashboardPage.selectFirstPatientFromList();
        await this.patientDetailPage.waitForMe();
      }
    );
    this.addTestStep(
      `Navigate to the DOB and try to change the data`,
      async () => {
        await this.patientDetailPage.waitForPatientStage();
        await this.patientDetailPage.fillDOB(randomDOB);
        await this.patientDetailPage.waitForDOB();
      }
    );
    this.addTestStep(
      `Enter new DOB and click "Save" button on bottom right`,
      async () => {
        await this.patientDetailPage.clickSaveChange();
        await this.dashboardPage.waitForMe();
        await this.dashboardPage.searchByName('Test007'); // in order to get the clean UI, use the stable data instead
        await this.dashboardPage.waitForPatientList();
        await this.dashboardPage.selectFirstPatientFromList();
        await this.patientDetailPage.waitForMe();
        await this.patientDetailPage.waitForDOB();
        await this.tab.waitForSelector(`input[value='${randomDOB}']`)
      }
    );
  }
}

new TestCase(
  "CC-893",
  `CC portal user is able to edit date of birth on Patient details page`
);
