// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Gacha {
    address payable public owner;
    uint256 public balance;
    mapping(uint => uint256) public characters;

    // events
    event Roll(uint256 charValue);
    event GetFreeRoll();
    event BurnCharacters();

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function getTwoStarCopies() public view returns(uint256) {
        return characters[2];
    }
    function getThreeStarCopies() public view returns(uint256) {
        return characters[3];
    }
    function getFourStarCopies() public view returns(uint256) {
        return characters[4];
    }
    function getFiveStarCopies() public view returns(uint256) {
        return characters[5];
    }
    function getSixStarCopies() public view returns(uint256) {
        return characters[6];
    }

    // custom errors
    error InsufficientBalance(uint256 balance);
    error InsufficientCharacters(uint256 totalCopies);

    function roll(uint charValue) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        uint _previousCharacterValue = characters[charValue];
        if (balance < 1) {
            revert InsufficientBalance({
                balance: balance
            });
        }

        // subtract 1 roll
        balance -= 1;

        // get a character
        characters[charValue] += 1;

        // revert if balance or characters have not been changed
        if ((balance != _previousBalance - 1 ) || (characters[charValue] != _previousCharacterValue + 1) ) {
            revert("Erroneous change in state... reverting.");
        }

        // emit the event
        emit Roll(charValue);
    }

    function getFreeRoll() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;

        // give 1 roll
        balance += 1;

        assert(balance == _previousBalance + 1);
    }

    function burnCharacters() public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;

        // get total copies of all characters
        uint totalCharacters = characters[2] + characters[3] + characters[4] + characters[5] + characters[6];
       
        // every 2 copies total is converted to 1 roll
        uint rolls = totalCharacters / 2;

        if (rolls < 1) {
            revert InsufficientCharacters({totalCopies: totalCharacters});
        }

        // burn character copies
        characters[2] = 0;
        characters[3] = 0;
        characters[4] = 0;
        characters[5] = 0;
        characters[6] = 0;

        // give x rolls
        balance += rolls;

        assert(balance == _previousBalance + rolls);
        assert(characters[2] == 0);
        assert(characters[3] == 0);
        assert(characters[4] == 0);
        assert(characters[5] == 0);
        assert(characters[6] == 0);

        emit BurnCharacters();
    }
}