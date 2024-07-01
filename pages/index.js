import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Gacha.sol/Gacha.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const [twoStarCopies, setTwoStarCopies] = useState(undefined)
  const [threeStarCopies, setThreeStarCopies] = useState(undefined)
  const [fourStarCopies, setFourStarCopies] = useState(undefined)
  const [fiveStarCopies, setFiveStarCopies] = useState(undefined)
  const [sixStarCopies, setSixStarCopies] = useState(undefined)

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const getCopies = async() => {
    if (atm) {
      setTwoStarCopies((await atm.getTwoStarCopies()).toNumber());
      setThreeStarCopies((await atm.getThreeStarCopies()).toNumber());
      setFourStarCopies((await atm.getFourStarCopies()).toNumber());
      setFiveStarCopies((await atm.getFiveStarCopies()).toNumber());
      setSixStarCopies((await atm.getSixStarCopies()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const roll = async() => {
    if (atm) {
      let charValue = Math.floor(Math.random() * 5) + 2;
      let tx = await atm.roll(charValue)
      await tx.wait();
      getBalance();
      getCopies();
    }
  }

  const getFreeRoll = async() => {
    if (atm) {
      let tx = await atm.getFreeRoll();
      await tx.wait();
      getBalance();
    }
  }

  const burnCharacters = async() => {
    if (atm) {
      let tx = await atm.burnCharacters();
      await tx.wait();
      getBalance();
      getCopies();
    }
  }
  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this service.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    if (twoStarCopies == undefined) {
      getCopies();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Rolls Remaining: {balance}</p>
        <br />
        <p>Two Star Copies: {twoStarCopies}</p>
        <p>Three Star Copies: {threeStarCopies}</p>
        <p>Four Star Copies: {fourStarCopies}</p>
        <p>Five Star Copies: {fiveStarCopies}</p>
        <p>Six Star Copies: {sixStarCopies}</p>
        <button onClick={roll}>Roll Random Character</button>
        <button onClick={getFreeRoll}>Get Free Roll</button>
        <button onClick={burnCharacters}>Burn All Characters</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Generic Gacha Game!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
