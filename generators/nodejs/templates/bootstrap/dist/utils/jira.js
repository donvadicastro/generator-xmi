"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require('jira-connector');
const pkg = require('../package.json');
const path = require('path');
const _ = require('underscore');
const chalk = require('chalk');
const fs = require("fs");
class JiraClient {
    constructor() {
        this.jira = new client({
            host: process.env.JIRA_URL,
            basic_auth: {
                email: process.env.JIRA_EMAIL,
                api_token: process.env.JIRA_TOKEN
            }
        });
    }
    sync(docDir) {
        return new Promise((resolve => fs.readdir(docDir, (err, files) => {
            files.forEach(x => this.syncFile(path.join(docDir, x)).catch(err => console.log(err)));
            resolve(files);
        })));
    }
    syncFile(fileName) {
        return new Promise((resolve, reject) => fs.readFile(fileName, 'utf-8', (err, data) => {
            let json = JSON.parse(data);
            let issue = { fields: {
                    project: { key: process.env.JIRA_PROJECT },
                    summary: json.name,
                    description: this.jiraTemplate({ data: json }),
                    issuetype: { name: "Story" }
                } };
            this.call(json.key ? 'editIssue' : 'createIssue', json.key ? { issueKey: json.key, issue: issue } : issue).then((data) => {
                console.log(`Issue ${json.key ? 'updated' : 'created'}: ${json.name}`);
                resolve(Object.assign({ data }, json));
            }, (err) => reject(err));
        })).then(data => fs.writeFileSync(fileName, JSON.stringify(data), 'utf-8'));
    }
    call(action, ...args) {
        return new Promise((resolve, reject) => {
            const params = [...args, (error, data) => error ? reject(error) : resolve(data)];
            this.jira.issue[action].apply(this.jira.issue, params);
        });
    }
    get jiraTemplate() {
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
exports.JiraClient = JiraClient;
//# sourceMappingURL=jira.js.map