import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-192
class TestCase extends MockableTestCase {
  email: string
  createTestSteps(): void {
    this.addTestStep('login in and get an actived staff', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickSettings();
      [, this.email, ] = await this.settingsPage.getOneActivedStaff();
      // logout
      await this.homePage.goto("/");
      await this.dashboardPage.logout();

    });

    this.addTestStep('login with step 1 staff', async () => {
      let password = AppConf.passwordForReset();
      await this.ccTestClient.setPoliciesAccept(this.email, password, true);
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit(this.email, password);
      await this.dashboardPage.waitForMe();
    });

    this.addTestStep('Verify if user can access "Settings" page using top user icon dropdown', async () => {
      await this.dashboardPage.hoverAvatarIcon();
      await this.tab.waitForSelector(`text="Settings"`, {state: 'hidden'})
    });
  }
}

new TestCase('CC-192', "Verification: Added staff member is NOT able to see practice profile page.");

