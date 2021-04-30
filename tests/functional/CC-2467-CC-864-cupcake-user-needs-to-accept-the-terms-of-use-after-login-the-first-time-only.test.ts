import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-864
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Go to CupCake Sign in form', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
      await this.dashboardPage.clickSettings();
    });

    this.addTestStep('Login with new account', async () => {
      let [, email, ] = await this.settingsPage.getOneInactiveStaff();
      // logout
      await this.homePage.goto("/")
      await this.dashboardPage.logout();
      // active account
      await this.tab.waitForTimeout(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
      await this.emailPage.clickAcceptInvitation();
      await this.activatePage.waitForMe();
      await this.activatePage.setPassword(AppConf.passwordForReset())
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForToast("Password set successfully");
    });

    this.addTestStep('On Terms of service page click on "Agree" button', async () => {
      await this.activatePage.clickAgree()
      await this.activatePage.clickAgree()
      await this.dashboardPage.waitForMe()
    });
  }
}

new TestCase('CC-864', "Verification: Every CupCake user needs to accept the Terms of Use, after login the first time only.");

