import {
  loadFixture,
  time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProtoCoin tests", function () {
  async function loadFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ProtoCoin = await ethers.getContractFactory("ProtoCoin");
    const protoCoin = await ProtoCoin.deploy();

    return { protoCoin, owner, otherAccount };
  }

  it("should have correct name", async function () {
    const { protoCoin } = await loadFixture();
    const name = await protoCoin.name();
    expect(name).to.equal("ProtoCoinV2");
  });

  it("should have correct symbol", async function () {
    const { protoCoin } = await loadFixture();
    const symbol = await protoCoin.symbol();
    expect(symbol).to.equal("NPTC");
  });

  it("should have correct decimals", async function () {
    const { protoCoin } = await loadFixture();
    const decimals = await protoCoin.decimals();
    expect(decimals).to.equal(18);
  });

  it("should have correct totalSupply", async function () {
    const { protoCoin } = await loadFixture();
    const totalSupply = await protoCoin.totalSupply();
    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });

  it("should be able to get balance", async function () {
    const { protoCoin, owner } = await loadFixture();
    const balance = await protoCoin.balanceOf(owner.address);
    expect(balance).to.equal(1000n * 10n ** 18n);
  });

  it("should be able to transfer", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();
    const balanceOwnerBefore = await protoCoin.balanceOf(owner.address);
    const balanceOtherBefore = await protoCoin.balanceOf(otherAccount.address);

    await protoCoin.transfer(otherAccount.address, 1n);

    const balanceOwnerAfter = await protoCoin.balanceOf(owner.address);
    const balanceOtherAfter = await protoCoin.balanceOf(otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) - 1n);

    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(1);
  });

  it("should not transfer if sender balance is lower than transfered value", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const instance = protoCoin.connect(otherAccount);
    await expect(instance.transfer(owner.address, 1n)).to.be.revertedWithCustomError(protoCoin, "ERC20InsufficientBalance");
  });

  it("should be able to approve", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();
    await protoCoin.approve(otherAccount.address, 1n);

    const allowance = await protoCoin.allowance(owner.address, otherAccount.address);

    expect(allowance).to.equal(1n);
  });

  it("should be able to transfer from", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();
    const balanceOwnerBefore = await protoCoin.balanceOf(owner.address);
    const balanceOtherBefore = await protoCoin.balanceOf(otherAccount.address);

    await protoCoin.approve(otherAccount.address, 10n);
    const instance = protoCoin.connect(otherAccount);
    await instance.transferFrom(owner.address, otherAccount.address, 5n);

    const balanceOwnerAfter = await protoCoin.balanceOf(owner.address);
    const balanceOtherAfter = await protoCoin.balanceOf(otherAccount.address);
    const allowanceLeft = await protoCoin.allowance(owner.address, otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) - 5n);

    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(5);

    expect(allowanceLeft).to.equal(5n);
  });

  it("should not transfer from (balance)", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const instance = protoCoin.connect(otherAccount);
    await instance.approve(owner.address, 1n)
    await expect(protoCoin.transferFrom(otherAccount.address, owner.address, 1n))
      .to.be.revertedWithCustomError(protoCoin, "ERC20InsufficientBalance");
  });

  it("should not transfer from (allowance)", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const instance = protoCoin.connect(otherAccount);
    await expect(instance.transferFrom(owner.address, otherAccount.address, 1n))
      .to.be.revertedWithCustomError(protoCoin, "ERC20InsufficientAllowance");
  });


  it("should not transfer from (not enough allowance)", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    await protoCoin.approve(otherAccount.address, 3n);
    const instance = protoCoin.connect(otherAccount);
    await expect(instance.transferFrom(owner.address, otherAccount.address, 4n))
      .to.be.revertedWithCustomError(protoCoin, "ERC20InsufficientAllowance");
  });

  it("should mint once", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const mintAmount = 1000n;
    await protoCoin.setMintAmount(mintAmount);

    const balanceBefore = await protoCoin.balanceOf(otherAccount.address);
    const instance = protoCoin.connect(otherAccount);
    await instance.mint();
    const balanceAfter = await protoCoin.balanceOf(otherAccount.address)
    expect(balanceAfter).to.equal(balanceBefore + mintAmount);
  });

  it("should mint twice (different accounts)", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const mintAmount = 1000n;
    await protoCoin.setMintAmount(mintAmount);

    const balanceBefore = await protoCoin.balanceOf(owner.address);
    await protoCoin.mint();

    const instance = protoCoin.connect(otherAccount);
    await instance.mint();

    const balanceAfter = await protoCoin.balanceOf(owner.address);
    expect(balanceAfter).to.equal(balanceBefore + mintAmount);
  });

  it("should mint twice (same account and different moments)", async function () {
    const { protoCoin, owner } = await loadFixture();

    const mintAmount = 1000n;
    await protoCoin.setMintAmount(mintAmount);

    const balanceBefore = await protoCoin.balanceOf(owner.address);
    await protoCoin.mint();

    const mintDelay = 60 * 60 * 24 * 2;
    await time.increase(mintDelay); // increases 2 day in seconds
    await protoCoin.mint();

    const balanceAfter = await protoCoin.balanceOf(owner.address);
    expect(balanceAfter).to.equal(balanceBefore + (mintAmount * 2n));
  });

  it("should not mint twice", async function () {
    const { protoCoin, owner } = await loadFixture();

    const mintAmount = 1000n;
    await protoCoin.setMintAmount(mintAmount);

    await protoCoin.mint();

    const mintDelay = 60 * 60 * 24 * 2;
    await expect(protoCoin.mint()).to.be.revertedWith("You cannot mint twice in a day");
  });

  it("should not allow to set mint amount", async function () {
    const { protoCoin, otherAccount } = await loadFixture();

    const instance = protoCoin.connect(otherAccount);

    await expect(instance.setMintAmount(1000n)).to.be.revertedWith("Only owner can call this function");
  });

  it("should not allow to set mint delay", async function () {
    const { protoCoin, owner, otherAccount } = await loadFixture();

    const instance = protoCoin.connect(otherAccount);

    await expect(instance.setMintDelay(1000n)).to.be.revertedWith("Only owner can call this function");
  });

  it("should not allow mint if mint amount is not enabled", async function () {
    const { protoCoin } = await loadFixture();

    await expect(protoCoin.mint()).to.be.revertedWith("Minting is not enabled");
  });
});
