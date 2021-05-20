import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-121
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('press three times tab key to forgot password link,then press enter key', async () => {
      await this.loginPage.tab.keyboard.press("Tab");
      await this.loginPage.tab.keyboard.press("Tab");
      await this.loginPage.tab.keyboard.press("Tab");
      await this.loginPage.clickForgotPassword();
      await this.resetPasswordPage.waitForMe();
      await this.resetPasswordPage.tab.goBack()
    })

    this.addTestStep('set email then press tab key and fill password', async () => {
      await this.loginPage.setEmail();
      await this.loginPage.tab.keyboard.press("Tab")
      await this.loginPage.tab.keyboard.type(AppConf.password())
      await this.loginPage.submit();
      await this.dashboardPage.waitForMe()
    });
  }
}

new TestCase('CC-121', 'Verification:  Tab functionality is working properly or not');

