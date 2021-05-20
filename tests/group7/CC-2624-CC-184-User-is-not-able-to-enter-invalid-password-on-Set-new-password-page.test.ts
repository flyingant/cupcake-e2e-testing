import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";


// https://teamsolace.atlassian.net/browse/CC-184
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
     
    this.addTestStep("Verify that 'Forgot password?' option is present on the screen.", async () => {
      await this.loginPage.waitForMe();
      await this.loginPage.waitForForgotPassword();
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
      await this.tab.waitForTimeout(5000);
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
    });

    this.addTestStep("Click on Password reset link and verify that user redirect to Set new password tab", async () => {
      await this.emailPage.clickResetPassword();
      await this.activatePage.waitForMe();
    });

    this.addTestStep('Verify that on entering invalid password (less than 6 characters) error message is display', async () => {
      await this.activatePage.setPassword("12345");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Minimum length of password is 8 characters");
    });

    this.addTestStep('Verify that on entering invalid password (without any number character) error message is display', async () => {
      await this.activatePage.fillPassWord("");
      await this.activatePage.waitForTimeout(1000);
      await this.activatePage.setPassword("qwe#rtab");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Password must contain at least one number and one special character (e.g. $,#,@,&...)");
    });

    this.addTestStep('Verify that on entering invalid password (without any special character) error message is display', async () => {
      await this.activatePage.fillPassWord("");
      await this.activatePage.waitForTimeout(1000);
      await this.activatePage.setPassword("qwe2rtab");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Password must contain at least one number and one special character (e.g. $,#,@,&...)");
    });
  }
}
new TestCase('CC-184', 'Verification:User is not able to enter invalid password on Set new password page');

