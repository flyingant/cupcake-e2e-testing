import { BrowserContext, Page } from 'playwright';
import DashboardPage from "../page-object-model/DashboardPage";
import HomePage from '../page-object-model/HomePage';
import LoginPage from "../page-object-model/LoginPage";
import MockableTestCase from "../src/MockableTestCase";


// https://teamsolace.atlassian.net/browse/CC-302
class TestCase extends MockableTestCase {

  context2 !: BrowserContext;
  tab2 !: Page;
  homePage2 : HomePage;
  loginPage2 : LoginPage;
  dashboardPage2 : DashboardPage;

  async beforeAll() {
    // browser 1 
    this.context = context;
		this.tab = page;

		this.homePage = new HomePage(this.tab);
		this.dashboardPage = new DashboardPage(this.tab);
		this.loginPage = new LoginPage(this.tab);

    // browser 2
    this.context2 = await browser.newContext();
    this.tab2 = await this.context2.newPage();

    this.homePage2 = new HomePage(this.tab2);
    this.loginPage2 = new LoginPage(this.tab2);
    this.dashboardPage2 = new DashboardPage(this.tab2);

    
		// await this.ccTestClient.init();
		this.setupNetworkInterceptor()
	}
  
  async afterAll() {
    super.afterAll();
    this.tab2.close();
    this.context2.close();
	}

  createTestSteps(): void {
    this.addTestStep('Start Browser 1', async () => {
      await this.homePage.start();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Start Browser 2', async () => {
      await this.homePage2.start();
      await this.loginPage2.waitForMe();
    });

    this.addTestStep('Login Browser1', async () => {
      await this.loginPage.setEmailPasswordAndThenSubmit();
      await this.dashboardPage.waitForMe();
    });
    
    this.addTestStep('Login Browser2', async () => {
      await this.loginPage2.setEmailPasswordAndThenSubmit();
      await this.dashboardPage2.waitForMe();
    });

    this.addTestStep('Browser1 Logout', async () => {
      await this.dashboardPage.logout();
      await this.loginPage.waitForMe();
    });

    this.addTestStep('Browser2 refresh', async () => {
      await this.dashboardPage.tab.reload();
      await this.dashboardPage2.waitForMe();
    });
  }
}

new TestCase('CC-302', 'Verification: Login in more than two browsers, then logout from any one of them and check all other account is proper working or all gets logout.');

