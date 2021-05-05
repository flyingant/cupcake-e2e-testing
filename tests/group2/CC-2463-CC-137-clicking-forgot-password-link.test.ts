import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-137
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });
    this.addTestStep('click forgot password', async () => {
      await this.loginPage.clickForgotPassword();
      await this.resetPasswordPage.waitForMe();
    });
  }
}

new TestCase('CC-137', 'Verification: User is redirected to Reset password page when clicking on Forgot Password link');

