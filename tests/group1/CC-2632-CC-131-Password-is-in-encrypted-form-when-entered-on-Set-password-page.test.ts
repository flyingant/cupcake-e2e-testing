import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";

// https://teamsolace.atlassian.net/browse/CC-2632
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(
      "Login to Cupcake as a clinic admin add a staff and go to email",
      async () => {
        await this.homePage.start();
        await this.loginPage.setEmailPasswordAndThenSubmit();
        await this.dashboardPage.waitForMe();
        // enter to setting, click add staff
        await this.dashboardPage.clickSettings();
        await this.settingsPage.clickAddStaffButton();
        await this.addStaffPage.waitForMe();
        // add staff
        const [
          firstName,
          lastName,
          email,
        ] = this.addStaffPage.generateStaffData();
        await this.addStaffPage.setFirstName(firstName);
        await this.addStaffPage.setLastName(lastName);
        await this.addStaffPage.setEmail(email);
        await this.addStaffPage.clickAddButtonAndWaitForToast();
        // Go to received email and open it
        await this.emailPage.sleep(5000);
        let emailContent = await this.ccTestClient.platform_getEmailForAddress(
          email
        );
        const path = await this.emailPage.saveEmail(
          this.id,
          emailContent["content"]
        );
        await this.emailPage.goto(path);
      }
    );

    this.addTestStep("Click on Activate Cupcake link", async () => {
      await this.emailPage.clickAcceptInvitation();
    });

    this.addTestStep("Enter password on password field", async () => {
      await this.activatePage.waitForMe();
      await this.activatePage.setPassword(AppConf.passwordForReset());
      let type = await this.tab.getAttribute("input", "type");
      expect(type).toBe("password");
    });
  }
}

new TestCase(
  "CC-131",
  "Verification: Password is in encrypted form when entered on Set password page"
);