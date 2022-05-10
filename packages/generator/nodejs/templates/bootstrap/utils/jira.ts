const client = require('jira-connector');
const pkg = require('../package.json');
const path = require('path');
const _ = require('underscore');
const chalk = require('chalk');

import fs = require('fs');

export class JiraClient {
    jira: any;
    config: any;

    constructor() {
        this.jira = new client({
            host: process.env.JIRA_URL,
            basic_auth: {
                email: process.env.JIRA_EMAIL,
                api_token: process.env.JIRA_TOKEN
            }
        });
    }

    public sync(docDir: string) {
        return new Promise((resolve =>
            fs.readdir(docDir, (err: any, files: string[]) => {
                files.forEach(x => this.syncFile(path.join(docDir, x)).catch(err => console.log(err)));
                resolve(files);
            })));
    }

    public syncFile(fileName: string): Promise<any> {
        return new Promise((resolve, reject) =>
            fs.readFile(fileName, 'utf-8', (err, data) => {
                let json: {key?: string, name: string, basicPathScenarios: string[]} = JSON.parse(data);
                let issue = {fields: {
                        project: { key: process.env.JIRA_PROJECT },
                        summary: json.name,
                        description: this.jiraTemplate({data: json}),
                        issuetype: { name: "Story" }
                    }};

                this.call(json.key ? 'editIssue' : 'createIssue',
                    json.key ? { issueKey: json.key, issue: issue } : issue).then((data) => {
                    console.log(`Issue ${json.key ? 'updated': 'created'}: ${json.name}`);
                    resolve({data, ...json});
                }, (err) => reject(err));
            })).then(data => fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8'));
    }

    public call(action: string, ...args: any[]) {
        return new Promise((resolve, reject) => {
            const params = [...args, (error: any, data: any) => error ? reject(error) : resolve(data)];
            this.jira.issue[action].apply(this.jira.issue, params);
        });
    }

    private get jiraTemplate() {
        return _.template(`
            <%= data.description %>
            
            h2. Scenarios
            <% _.each(data.scenarios, function(scenario) { %>
            h4. <%= scenario.type %>
            <% _.each(scenario.steps, function(step) { %>
            * <%= step %>
            <% }) %>
            <% }) %>
        `);
    }
}
