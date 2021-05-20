import TestComponent from './TestComponent';
import { writeFileSync, mkdirSync, existsSync } from "fs";
import * as path from 'path';

export default class EmailPage extends TestComponent {

    async waitForMe() {
        await this.tab.waitForSelector("'The Boston Scientific Cloud Team'");
    }

    async saveEmail(emailName: string, emailContent: string){
        const dir = `./tests/output/`;
        let htmlContent = emailContent;
        let filePath = `${dir}${browserName}-${emailName}.html`;
        if (!existsSync(dir)) {
          mkdirSync(dir); // make sure the target directory is exist
        }
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