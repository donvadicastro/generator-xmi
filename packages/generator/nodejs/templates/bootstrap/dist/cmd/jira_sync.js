"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jira_1 = require("../utils/jira");
const client = new jira_1.JiraClient();
client.sync('documentation/useCases');
//# sourceMappingURL=jira_sync.js.map