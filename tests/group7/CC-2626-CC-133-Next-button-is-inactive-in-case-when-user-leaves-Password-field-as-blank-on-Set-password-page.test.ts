import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";


// https://teamsolace.atlassian.net/browse/CC-133
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

    this.addTestStep("Open Set password page", async () => {
      await this.emailPage.clickResetPassword();
      await this.activatePage.waitForMe();
    });

    this.addTestStep('Verify that arrow button does not active', async () => {
      let status=this.activatePage.isSubmitButtonDisabled();
      expect(status).resolves.toEqual(false); 
    });

    this.addTestStep('Leave password field blank and verify that  arrow button is inactive', async () => {
      await this.activatePage.setPassword("");
      let status = this.activatePage.isSubmitButtonDisabled();
      expect(status).resolves.toEqual(false); 
    });
  }
}
new TestCase('CC-133', 'Verification: Next ->button is inactive in case when user leaves Password field as blank on Set password page');

