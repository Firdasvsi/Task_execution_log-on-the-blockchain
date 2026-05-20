import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  let yourContract: YourContract;

  before(async () => {
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await yourContractFactory.deploy()) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("addTask", function () {
    it("Should add a task successfully", async function () {
      await yourContract.addTask("Сделать домашнее задание");
      const count = await yourContract.getTaskCount();
      expect(count).to.equal(1n);
    });
  });

  describe("TaskAdded event", function () {
    it("Should emit TaskAdded event", async function () {
      await expect(yourContract.addTask("Купить продукты"))
        .to.emit(yourContract, "TaskAdded")
        .withArgs(1n, "Купить продукты");
    });
  });

  describe("require check", function () {
    it("Should revert when title is empty", async function () {
      await expect(yourContract.addTask("")).to.be.revertedWith("Title cannot be empty");
    });
  });
});
