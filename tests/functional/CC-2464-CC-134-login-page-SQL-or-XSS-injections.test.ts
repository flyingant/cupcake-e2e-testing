import AppConf from "../src/AppConf";
import MockableTestCase from "../src/MockableTestCase";

// https://teamsolace.atlassian.net/browse/CC-134
class TestCase extends MockableTestCase {
  createTestSteps(): void {
    this.addTestStep('Start', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Login with invalid Email and SQL Password', async () => {
      let username = AppConf.userName()
      let password = "select * from users where username='' or 1=1#' and password=md5('')"
      await this.loginPage.setEmailPasswordAndThenSubmit(username, password);
      await this.loginPage.waitForToast("Invalid login ID or password");
    });

    this.addTestStep('Login with HTML Email and invalid Password', async () => {
      await this.loginPage.tab.reload()
      let username = AppConf.userName()
      let password = "<script>evil_script()</script>"
      await this.loginPage.setEmailPasswordAndThenSubmit(username, password);
      await this.loginPage.waitForToast("Invalid login ID or password");
    });

    this.addTestStep('Login with invalid Email and HTML Password', async () => {
      await this.loginPage.tab.reload()
      let username = "<script>evil_script()</script>"
      let password = AppConf.password()
      await this.loginPage.setEmailAndPassword(username, password);
      await this.loginPage.waitForText("Please enter a valid email address");
    });
  }
}

new TestCase('CC-134', 'Verification: Whether Login page is not vulnerable to SQL or XSS injections');

