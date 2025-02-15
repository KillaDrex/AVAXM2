# Gacha Game dAPP

This is a decentralized application that mimics a Gacha game. The core mechanic of these games is that you can get a random character in exchange for some in-game currency. This is my submission for the ETH + AVAX Proof: Intermediate EVM Course Module 2 Project.

## Description

It is a smart contract written in Solidity, and the front-end is developed using React. The smart contract has three (3) main functions.

### Program Functions

```javascript
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
```

The roll() function takes in a character value, which represents their star rate. It then subtracts from balance and also adds a copy to that character star rate.

The getFreeRoll() function gives 1 free roll, which is the balance of this dAPP. You can exchange 1 roll for a random character.

Finally, the burnCharacters() function burns all copies of all characters in exchange for some balance. Every 2 copies regardless of star rate, gives exactly 1 roll.

## Authors

Andre A. Aquino 

