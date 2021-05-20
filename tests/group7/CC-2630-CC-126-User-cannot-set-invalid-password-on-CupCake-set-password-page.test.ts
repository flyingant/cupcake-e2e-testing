import MockableTestCase from "../src/MockableTestCase";
import AppConf from "../src/AppConf";


// https://teamsolace.atlassian.net/browse/CC-126
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

    this.addTestStep("Go to Email", async () => {
      // wait for email sync
      await this.tab.waitForTimeout(5000);
      let emailContent = await this.ccTestClient.platform_getEmailForAddress(this.email);
      let path = await this.emailPage.saveEmail(this.id, emailContent['content']);
      await this.emailPage.goto(path);
    });

    this.addTestStep("Click on Activate Cupcake link", async () => {
      await this.emailPage.clickResetPassword();
      await this.activatePage.waitForMe();
    });

    this.addTestStep('Verify that on entering invalid password (less than 8 characters) "Submit" button does not active and error message present on the page', async () => {
      await this.activatePage.setPassword("1234567");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Minimum length of password is 8 characters");
      let status = this.activatePage.isSubmitButtonDisabled();
      expect(status).resolves.toEqual(false); 
    });

    this.addTestStep('Verify that on entering invalid password (8 or more characters without any number symbol)  "Submit" button does not active and error message present on the page', async () => {
      await this.activatePage.fillPassWord("");
      await this.activatePage.waitForTimeout(1000);
      await this.activatePage.setPassword("qwe#rtabe");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Password must contain at least one number and one special character (e.g. $,#,@,&...)");
      let status = this.activatePage.isSubmitButtonDisabled();
      expect(status).resolves.toEqual(false); 
    });

    this.addTestStep('Verify that on entering invalid password (8 or more characters without any special characters) "Submit" button does not active and error message present on the page', async () => {
      await this.activatePage.fillPassWord("");
      await this.activatePage.waitForTimeout(1000);
      await this.activatePage.setPassword("qwe2rtabe");
      await this.activatePage.clickNextButton();
      await this.activatePage.waitForText("Password must contain at least one number and one special character (e.g. $,#,@,&...)");
      let status = this.activatePage.isSubmitButtonDisabled();
      expect(status).resolves.toEqual(false); 
    });

  }
}
new TestCase('CC-126', 'Verification: User cannot set invalid password on CupCake set password page');

