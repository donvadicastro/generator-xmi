import {JiraClient} from "../../../generators/app/templates/default/bootstrap/utils/jira";
const path = require('path');

describe('JIRA utils', () => {
    let jira: JiraClient;

    const config = {jira: {
        url: 'programping.atlassian.net',
        username: 'vadim.barilo@gmail.com',
        password: 'Kb48ss7tdhVVmfzISZZp13BB',
        project: 'AP'
    }};

    beforeEach(() => {
        jira = new JiraClient(config);
    });

    it('should sync correct', (done) => {
        jira.syncFile = jasmine.createSpy('jira.syncFile');
        jira.sync(path.dirname(__dirname) + '\\data').then(() => {
            expect(jira.syncFile).toHaveBeenCalledTimes(2);
            done();
        });
    });

    it('should sync file correct', (done) => {
        jest.spyOn(jira, 'call');

        jira.syncFile(path.dirname(__dirname) + '\\data\\useCase1.json')
            .then(() => {
                expect(jira.call).toHaveBeenCalledWith('createIssue', {
                    fields: {
                        project: { key: "AP" },
                        summary: "useCase1",
                        description: expect.any(String),
                        issuetype: { name: "Story" }
                    }
                });
                done();
            });
    });
});