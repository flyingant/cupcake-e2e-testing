import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2625
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Open Welcome to Cupcake page`, async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });
    this.addTestStep(`Verify that 'Forgot password?' option is present on the screen.`, async () => {
      await this.loginPage.waitForForgotPassword();
    });
    this.addTestStep(`Click on 'Forgot password?' option`, async () => {
      await this.loginPage.clickForgotPassword();
      await this.resetPasswordPage.waitForMe();
    });
    this.addTestStep(`Verify that on entering invalid email validation message is display`, async () => {
      await this.resetPasswordPage.fillEmail('123456789');
      await this.resetPasswordPage.waitForEmailValidateErrorMessage();
    });
  }
}

new TestCase('CC-183', `Validation message is displayed in case if user enter invalid email id on Reset password page after clicking on 'Forgot password' option`);
