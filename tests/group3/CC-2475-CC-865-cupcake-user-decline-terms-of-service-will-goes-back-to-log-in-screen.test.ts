import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-865
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Go to CupCake Sign in form', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with new account', async () => {
      let username = AppConf.userNameForPoliciesAccept();
      let password = AppConf.passwordForPoliciesAccept();
      await this.ccTestClient.setPoliciesAccept(username, password, false);
      await this.loginPage.setEmailPasswordAndThenSubmit(username, password);
    });

    this.addTestStep('On Terms of service page click on "Decline" button', async () => {
      await this.activatePage.clickDecline()
      await this.activatePage.clickYesExit()
      await this.loginPage.waitForMe()
    });
  }
}

new TestCase('CC-865', "Verification: If CupCake user doesn't accept Terms of service he/she goes back to log in screen");

