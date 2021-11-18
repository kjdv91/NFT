import './styles/App.css';
import myEpicNft from './utils/MyEpicNFT.json';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const TWITTER_HANDLE = 'kjdv91';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/squarenft-wwozz6khea';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = '0x2e22B6E585AA107C8d7Bfda57ECD7ed6E9983669';

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState(null);
  const [tokenStats, setTokenStats] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

 useEffect(() => {
    isWalletConnected();
  }, []);

const isWalletConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setError("Please install Metamask extension");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      setupEventListener();
    } else {
      setError("Please connect your wallet");
      return;
    }

    ethereum.on("chainChanged", (id) => {
      if (id !== "0x4") {
        setError("Please choose rinkeby network");
        return;
      } else {
        setError(null);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        connectContract
          .getTotal()
          .then((res) => parseInt(res._hex, 16))
          .then((res) => setTokenStats(res))
          .catch(console.log);
      }
    });

    if (ethereum.networkVersion !== "4") {
      setError("You are on a wrong network. Please choose Rinkeby network");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicNft.abi,
      signer
    );
    connectContract
      .getTotal()
      .then((res) => parseInt(res._hex, 16))
      .then((res) => setTokenStats(res))
      .catch(console.log);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("get mask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);

      ethereum.on("chainChanged", (id) => {
        if (id !== "0x4") {
          setError("Please choose rinkeby network");
          return;
        } else {
          setError(null);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            myEpicNft.abi,
            signer
          );
          connectContract
            .getTotal()
            .then((res) => parseInt(res._hex, 16))
            .then((res) => setTokenStats(res))
            .catch(console.log);
        }
      });

      if (ethereum.networkVersion !== "4") {
        setError(
          "You are connected but on a wrong network. Please choose Rinkeby network"
        );
      } else {
        setupEventListener();
        setError(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderConnectButton = () => (
    <button
      style={{
        color: "white",
        width: "350px",       
        fontSize: "large",
        padding: "1rem 2rem",
        fontWeight: "bold",
        margin: "1rem 0",
        backgroundImage: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
        border: "none",
        borderRadius: "1rem",
        boxShadow: "rgba(14, 157, 165, 10.12) 0px 8px 24px",
      }}
      onClick={connectWallet}
    >
      Connect wallet
    </button>
  );

  const renderConsole = () => {
    return (
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {tokenStats && (
          <div
            style={
              tokenStats && {
                color: "white",
                backgroundColor: "rgba(13,94,71,3)",
                padding: "10px 20px",
                borderRadius: "10px",
                margin: "30px,0px,0px,50px",
              }
            }
          >
            {`${tokenStats} out of 25 allowed NFTs are alreadyminted`}
          </div>
        )}
        <a
          href="https://testnets.opensea.io/collection/squarenft-wwozz6khea"
          style={{ color: "#fd1d92",
          padding: "20px 20px",
           }}
        >
           View Collection on OpenSea
        </a>

        <button
          className="cta-button connect-wallet-button"
          disabled={error}
          onClick={askContractToMintNft}
        >
          {isMinting ? "Minting..." : "Mint UI"}
        </button>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: ".3rem 1rem",
          backgroundColor: "lightyellow",
          borderRadius: "10px",
          color: "magenta",
          fontWeight: "bold",
        }}
      >
        <p>{error}</p>
      </div>
    );
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        try {
          console.log("going to pop wallet now to pay gas");
          setIsMinting(true);
          let nftTransaction = await connectContract.makeAnEpicNFT();
          console.log("mining... please wait");
          await nftTransaction.wait();

          connectContract
            .getTotal()
            .then((res) => parseInt(res._hex, 16))
            .then((res) => setTokenStats(res))
            .catch(console.log);
          setIsMinting(false);
          console.log(
            `mined, see the transaction at https://rinkeby.etherscan.io/tx/${nftTransaction.hash}`
          );
        } catch (e) {
          if (e.error.code === -32603) {
            setError(
              "Unfortunately maximum number of allowed NFTs is reached and no more NFT can be minted"
            );

            setIsMinting(false);
            return;
          }
          console.log(e);
        }
      } else {
        console.log("ethereum object doesn't exist");
      }
    } catch (e) {
      setIsMinting(false);
    }
  };

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          setTokenStats(tokenId.toNumber() + 1);
          console.log(`${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
        });

        connectedContract
          .getTotal()
          .then((res) => parseInt(res._hex, 16))
          .then((res) => setTokenStats(res))
          .catch(console.log);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
       
      }}
    >
      <h1 class = "gradient-text">
        My NFT Collection
      </h1>
      <div>
        {error ? renderError() : renderConsole()}
        {currentAccount[0] ? "" : renderConnectButton()}
      </div>

      <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
    </div>

     
  );
}