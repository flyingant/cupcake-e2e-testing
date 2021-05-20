import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2312
class TestCase extends MockableTestCase {

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake portal as a clinic coordinator",
      async () => {
        await this.homePage.start();
        await this.loginPage.fillEmailAndPasswordWithoutDelay(AppConf.getStableAccountUsername(), AppConf.getStableAccountPassword());
        await this.dashboardPage.waitForMe();
        await this.dashboardPage.waitForPatientList();
      }
    );

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep(`Click on "Add staff member" button`, async () => {
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
    });

    this.addTestStep(`In field First name enter data with 2 symbols and hit "Enter" button`, async () => {
      await this.addStaffPage.setFirstName('ab');
      await this.addStaffPage.waitForFirstNameWarningMessage();
    });

    this.addTestStep(`In field Last name enter data with 2 symbols and hit "Enter" button`, async () => {
      await this.addStaffPage.setLastName('cd');
      await this.addStaffPage.waitForLastNameWarningMessage();
    });
  }
}

new TestCase(
  "CC-510",
  `Inline field error message “Min 3 characters are required“ is displayed if less than 3 characters are entered in First name or Last name fields`
);