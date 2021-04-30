import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";


// https://teamsolace.atlassian.net/browse/CC-182
class TestCase extends MockableTestCase {
  email: string

  createTestSteps(): void {
    this.addTestStep('Open Welcome to Cupcake page', async () => {
      await this.homePage.start();

      // get an actived staff
      await this.loginPage.waitForMe();
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.clickSettings();
      [, this.email, ] = await this.settingsPage.getOneActivedStaff();

      // logout
      await this.homePage.goto("/");
      await this.dashboardPage.logout();
    });


    this.addTestStep("Click on 'Forgot password?' option", async () => {
      await this.loginPage.clickForgotPassword();
      await this.resetPasswordPage.waitForMe();
    });

    this.addTestStep('Enter email id which the user used to sign in', async () => {
      await this.resetPasswordPage.setEmailAndThenSubmit(this.email)
    });

    this.addTestStep("Open email and verify that Password reset link is receive", async () => {
      // wait for email sync
      await this.tab.waitForTimeout(5000)
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
    });

    this.addTestStep("Click on Password reset link and verify that user redirect to Set new password page", async () => {
      await this.emailPage.clickResetPassword();
      await this.activatePage.waitForMe();
    });

    this.addTestStep('Fill in field with valid characters and confirm action', async () => {
      await this.activatePage.setPassword(AppConf.passwordForReset());
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForToast("Password set successfully")
    });
  }
}
new TestCase('CC-182', 'Verification: User is able to reset password');

