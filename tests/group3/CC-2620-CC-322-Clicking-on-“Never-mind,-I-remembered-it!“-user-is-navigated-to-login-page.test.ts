import MockableTestCase from "../src/MockableTestCase";
import AppConf from '../src/AppConf';

// https://teamsolace.atlassian.net/browse/CC-2620
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep(`Open Welcome to Cupcake page`, async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
      await this.loginPage.waitForForgotPassword();
    });
    this.addTestStep(`Click on 'Forgot password?' option`, async () => {
      await this.loginPage.clickForgotPassword();
      await this.resetPasswordPage.waitForMe();
    });
    this.addTestStep(`Verify  that clicking on 'Never mind, I remembered it' option user is navigated to login page`, async () => {
      await this.resetPasswordPage.clickNeverMindBtn();
      await this.loginPage.waitForMe();
      await this.loginPage.waitForForgotPassword();
    });
  }
}

new TestCase('CC-322', `Clicking on “Never mind, I remembered it!“ user is navigated to login page.`);
