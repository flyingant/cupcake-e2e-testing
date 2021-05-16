import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2322
class TestCase extends MockableTestCase {
  firstName: string;
  lastName: string;
  email: string;

  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake practice page as a clinic admin",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
      }
    );

    this.addTestStep("Go to Settings on clinic profile page", async () => {
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickSettings();
      await this.settingsPage.waitForMe();
    });

    this.addTestStep('Click on "Add staff member" button', async () => {
      await this.settingsPage.clickAddStaffButton();
      await this.addStaffPage.waitForMe();
    });
    this.addTestStep("Send invitation email to new staff member", async () => {
      [
        this.firstName,
        this.lastName,
        this.email,
      ] = this.addStaffPage.generateStaffData();
      await this.addStaffPage.setFirstName(this.firstName);
      await this.addStaffPage.setLastName(this.lastName);
      await this.addStaffPage.setEmail(this.email);
      await this.addStaffPage.clickAddButtonAndWaitForToast();
    });

    this.addTestStep("Click on magic activation link", async () => {
      await this.emailPage.sleep(5000);
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(
        this.email
      );
      let path = await this.emailPage.saveEmail(
        this.id,
        emailContent["content"]
      );
      await this.emailPage.goto(path);
      await this.emailPage.clickAcceptInvitation();
      await this.activatePage.waitForMe();
    });
    this.addTestStep("Go to Cupcake as a clinic admin", async () => {
      await this.homePage.goto("/settings");
      await this.settingsPage.waitForMe();
    });
    this.addTestStep(
      "Verify if added user is displayed on settings page",
      async () => {
        await this.settingsPage.getStaffLineInfoByEmail(this.email);
      }
    );
  }
}

new TestCase(
  "CC-315",
  "Verification: On successful user addition, the user is added to the list of staff members on setting page."
);
