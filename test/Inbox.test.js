const DEFAULT_MESSAGE = "Hi there!";
const DEFAULT_BYE_MESSAGE = "Goodbye!";
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
  // Get all account
  accounts = await web3.eth.getAccounts();
  // Use one of those account to
  // The contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [DEFAULT_MESSAGE] })
    .send({ from: accounts[0], gas: "1000000" });
  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("Deploys a contract!", () => {
    assert.ok(inbox.options.address);
  });

  it("Has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, DEFAULT_MESSAGE);
  });

  it("Can change message", async () => {
    const address = await inbox.methods
      .setMessage(DEFAULT_BYE_MESSAGE)
      .send({ from: accounts[0] , gas: "1000000"});
    console.log(address);
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, DEFAULT_BYE_MESSAGE);
  });
});
