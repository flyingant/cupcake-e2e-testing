import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-2321
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
    this.addTestStep(
      "Verify if new added staff member is displayed practice profile page.",
      async () => {
        [
          this.firstName,
          this.lastName,
          this.email,
        ] = this.addStaffPage.generateStaffData();
        await this.addStaffPage.setFirstName(this.firstName);
        await this.addStaffPage.setLastName(this.lastName);
        await this.addStaffPage.setEmail(this.email);
        await this.addStaffPage.clickAddButtonAndWaitForToast();
        await this.settingsPage.getStaffLineInfoByEmail(this.email);
      }
    );

    this.addTestStep(
      "Check if there is possibility to resend activation link to user who already activated his profile",
      async () => {
        // --- start: Go to received email and open it ---
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
        // --- end: Go to received email and open it ---
        this.homePage.goto("/settings");
        await this.settingsPage.waitForMe();
        let [, , , status] = await this.settingsPage.getStaffLineInfoByEmail(
          this.email
        );
        expect(status).toBe(false);
      }
    );
  }
}

new TestCase(
  "CC-319",
  "Clinic coordinator is NOT able to resend the invitation link to staff member which already activated his/her account"
);
