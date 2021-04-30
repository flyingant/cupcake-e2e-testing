import TestComponent from './TestComponent';
import { writeFileSync } from "fs";
import * as path from 'path';

export default class EmailPage extends TestComponent {

    async waitForMe() {
        await this.tab.waitForSelector("'The Boston Scientific Cloud Team'");
    }

    async saveEmail(emailName: string, emailContent: string){
        let htmlContent = emailContent;
        let filePath = `./tests/output/${browserName}-${emailName}.html`;
        writeFileSync(filePath, htmlContent);
        return path.resolve(filePath);
    }

    async goto(path: string){
        await this.tab.goto("file://" + path);
    }

    async clickAcceptInvitation(){
        await this.tab.click("text='Accept Invitation'")
    }

    async clickResetPassword(){
        await this.tab.click("text='Reset Password'")
    }
}