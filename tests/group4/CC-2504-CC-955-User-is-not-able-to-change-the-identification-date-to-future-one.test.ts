import { endOfTomorrow, format } from "date-fns";
import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2504
class TestCase extends MockableTestCase {
  createTestSteps(): void {
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
        await this.dashboardPage.searchByName("Test008"); // make sure patient exits and have identified
        await this.dashboardPage.waitForPatientList();
        await this.dashboardPage.selectFirstPatientFromList();
        await this.patientDetailPage.waitForMe();
      }
    );
    this.addTestStep(
      `Enter a future date then will get error tip`,
      async () => {
        const tomorrow = format(endOfTomorrow(), "MM/dd/yyyy");
        await this.patientDetailPage.waitForPatientStage();
        await this.patientDetailPage.setCreatedDate(tomorrow);
        await this.tab.click("h2"); // blur the created date input
        const error = await this.tab.innerText(
          "span:below(input[id=patientCreatedDate])"
        );
        expect(error).toBe("identified date should not be later than today");
      }
    );
  }
}

new TestCase(
  "CC-955",
  `User is not able to change the identification date to future one`
);
