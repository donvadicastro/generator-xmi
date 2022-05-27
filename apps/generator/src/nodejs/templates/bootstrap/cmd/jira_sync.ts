import {JiraClient} from "../utils/jira";

const client = new JiraClient();
client.sync('documentation/useCases');