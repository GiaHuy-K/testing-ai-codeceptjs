class testsceneries {
    constructor(email, password, scenario) {
        this.email = email;
        this.password = password;
        this.scenario = scenario;
    }
}

const testCases = [
    new testsceneries("johnsmith@gmail.com", "G8dh4JkP2aL3M9", "Logging into SocialBuzz"),
    new testsceneries("emilychen@gmail.com", "R6eT7A8S5D3N2", "Accessing BankOfTheFuture"),
    new testsceneries("davidlee@gmail.com", "P4aS1E2T3O9", "Logging into EtsyWorld"),
    new testsceneries("sarahjones@gmail.com", "M5yH7gF4kP8", "Accessing SkillUp"),
    new testsceneries("tommybrown@gmail.com", "E9cD3t1A2S6", "Logging into GameOn"),
];

module.exports = testCases;
