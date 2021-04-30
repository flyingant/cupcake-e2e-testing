import { writeFileSync } from 'fs';
import { BrowserContext, Page, Request } from 'playwright';
import ActivatePage from '../page-object-model/ActivatePage';
import AddPatientPage from '../page-object-model/AddPatientPage';
import AddStaffPage from '../page-object-model/AddStaffPage';
import DashboardPage from '../page-object-model/DashboardPage';
import HomePage from '../page-object-model/HomePage';
import LoginPage from '../page-object-model/LoginPage';
import ResetPasswordPage from '../page-object-model/ResetPasswordPage';
import SettingsPage from '../page-object-model/SettingsPage';
import TermsOfUsePage from '../page-object-model/TermsOfUsePage';
import TestComponent from '../page-object-model/TestComponent';
import UploadBannerPage from '../page-object-model/UploadBannerPage';
import PatientDetailPage from '../page-object-model/PatientDetailPage';
import EmailPage from '../page-object-model/EmailPage';
import CalendarPage from '../page-object-model/CalendarPage';
import AppConf from './AppConf';
import CCTestClient from './CCTestClient';
import RequestResponse from './RequestResponse';
import Color from './Color'

export default abstract class AbstractTestCase {
	id: string;
	title: string;

	testStepIndex: number
	prevTestSucceed: boolean

	context!: BrowserContext;
	tab!: Page;

	numOfApiRequests: number = 0;
	apiCalls: RequestResponse[] = [];

	ccTestClient: CCTestClient;
	color: Color;

	homePage : HomePage;
	activatePage : ActivatePage;
	addPatientPage : AddPatientPage;
	addStaffPage : AddStaffPage;
	dashboardPage : DashboardPage;
	loginPage : LoginPage;
	settingsPage : SettingsPage;
	termsOfUsePage : TermsOfUsePage;
	testComponent : TestComponent;
	uploadBannerPage : UploadBannerPage;
	resetPasswordPage: ResetPasswordPage;
	patientDetailPage: PatientDetailPage;
	emailPage: EmailPage;
	calendarPage: CalendarPage;

	abstract createTestSteps() : void;

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
		this.testStepIndex = 0
		this.prevTestSucceed = true

		this.ccTestClient = new CCTestClient();
		this.color = new Color();

		this.setupTestSuite();
	}

	getSavePathAndFilePrefix() {
		return `./tests/output/${browserName}-${this.id}`
	}

	addTestStep(name: string, jestClosure: () => Promise<void>) {
		it(name, async () => {
			expect(this.prevTestSucceed).toBe(true)
			try {
				await jestClosure()
			} catch(testException) {
				this.prevTestSucceed = false
				throw(testException)
			}
		})
	}

	private setupTestSuite() {
		const jestTimeout = process.env.jest_timeout
		if(jestTimeout)
			jest.setTimeout(parseInt(jestTimeout))
		else
			jest.setTimeout(90000);
			
		beforeAll(async () => {
			await this.beforeAll();
		});

		afterAll(async () => {
			await this.afterAll();
		});

		beforeEach(async () => {
			this.testStepIndex++
			const testName = expect.getState().currentTestName.split('::')[2]
			this.stepLog(`${testName} - Before`)
		})

		afterEach(async () => {
			const testName = expect.getState().currentTestName.split('::')[2]
			this.stepLog(`${testName} - After`)
			try {
				await this.tab.screenshot({
          path:`${this.getSavePathAndFilePrefix()}-after-step-${this.testStepIndex}.png`
        });
			} catch (e) {
				//
			}
		})

		describe(`${browserName} - ${this.id} :: ${this.title} :: `, () => {
			// it("Start test case", async () => {
			// 	console.log("start test case", new Date().toLocaleString())
			// })

			this.createTestSteps();

			// it("Wait for network idle", async () => {
			// 	await this.waitForAllApiRequestCompleted(60000);
			// 	console.log(new Date().toLocaleString(), "AllApiRequestCompleted")
			// })
		});
	}

	async waitForAllApiRequestCompleted(timeout:number) {
		let startTime = Date.now();
		while(this.numOfApiRequests>0 && (Date.now() - startTime < timeout)) {
			await this.tab.waitForTimeout(100);
		}
	}

	log(msg: string) {
		process.stdout.write(`${new Date().toLocaleString()} ${this.id}\t${msg} \n`)
	}

	stepLog(msg: string) {
		this.log(`Step ${this.testStepIndex} ${msg}`)
	}

	async beforeAll() {
		Error.stackTraceLimit = Infinity;
		this.log(`BeforeAll ${this.title}`)
		this.context = context;
		this.tab = page;
		
		if(process.env.new_context_pre_test === 'true') {
			this.context = await browser.newContext();
			this.tab = await this.context.newPage();
		}

		await this.ccTestClient.init();
		if(process.env.record_api_call === 'true') {
			this.setupNetworkInterceptor()
		}

		this.homePage = new HomePage(this.tab);
		this.activatePage = new ActivatePage(this.tab);
		this.addPatientPage = new AddPatientPage(this.tab);
		this.addStaffPage = new AddStaffPage(this.tab);
		this.dashboardPage = new DashboardPage(this.tab);
		this.loginPage = new LoginPage(this.tab);
		this.settingsPage = new SettingsPage(this.tab);
		this.termsOfUsePage = new TermsOfUsePage(this.tab);
		this.uploadBannerPage = new UploadBannerPage(this.tab);
		this.resetPasswordPage = new ResetPasswordPage(this.tab);
		this.patientDetailPage = new PatientDetailPage(this.tab);
		this.emailPage = new EmailPage(this.tab);
		this.calendarPage = new CalendarPage(this.tab);
	}

	async afterAll() {
		if(!AppConf.shouldMockRequest()) {
			writeFileSync(this.getSavePathAndFilePrefix()+".json", JSON.stringify(this.apiCalls));
		}
		try {
			// await this.tab.screenshot({path:`${this.getSavePathAndFilePrefix()}-afterAll.png`});
		} catch (e) {
			//
		}
		
		if(process.env.new_context_pre_test === 'true') {
			await this.tab.close();
			await this.context.close();
		}

		this.log(`AfterAll`)
	}

	protected setupNetworkInterceptor() {
		this.tab.on("request", async request => {
			if(this.isApiRequest(request)) {
				this.numOfApiRequests ++;
				// console.log(new Date().toLocaleString() + "  " + request.url() + " --> start " + this.numOfApiRequests)
			}
		});

		this.tab.on("requestfinished", async request => {
			if(this.isApiRequest(request)) {
				this.numOfApiRequests --;
				// console.log(new Date().toLocaleString() + "  " + request.url() + " --> succeed " + this.numOfApiRequests)
				this.apiCalls.push(await RequestResponse.create(request));

				if(this.numOfApiRequests == 0) {
					// process.stdout.write(`${new Date().toLocaleString()} numOfApiRequests == 0 ${request.url()}\n`)
				}
			}
		})

		this.tab.on("requestfailed", async request => {
			if(this.isApiRequest(request)) {
				this.numOfApiRequests --;
				// console.log(request.url() + " --> failed " + this.numOfApiRequests)
				this.apiCalls.push(await RequestResponse.create(request));
			}
		})
	}

	isApiRequest(request: Request): boolean {
		return request.url().startsWith(AppConf.baseApiUrl());
	}

	getFullPath(path: string) : string {
		return AppConf.baseUrl() + path;
	}
	
	getFullAPIPath(path: string) : string {
		return AppConf.baseApiUrl() + path;
	}
}