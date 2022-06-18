//    getTheTokensOfOwner()
import { WalletAdapterNetwork,WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import ReactDOM from 'react-dom';
import validNftsA from './hashlist.json';

import './css/bootstrap.min.css'
import { Connection } from '@metaplex/js'; 

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';


import { clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';


import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

let tokensInWallet:any[] = []
let validTokensInWallet: string[] = []

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletExtensionWalletAdapter(),
            new SolletWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {

let [nftsInWallet, setNftsinWallet] = useState(0)
let [statusHolder, setStatusHolder] = useState(false)

const connection = new Connection("https://api.mainnet-beta.solana.com");

    
    //getTokenAccountsByOwner(publicKey,)

    let elements:any = []
    let element;
    
  
   

    
    async function getAccountMetaData(mintAddress, amountI, numberI){
       (async () => {
        let mintPubkey = new PublicKey(mintAddress);
        let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
      
        const tokenmeta:any = await Metadata.load(connection, tokenmetaPubkey);
        //console.log(tokenmeta);
       // console.log(tokenmeta.data.data["name"])
       // nftsInWallet.push({name: tokenmeta.data.data["name"], uri: tokenmeta.data.data["uri"]})
        //console.log("nfts: "+nftsInWallet)
       tokensInWallet[numberI].name = tokenmeta.data.data["name"]
       tokensInWallet[numberI].uri = tokenmeta.data.data["uri"]
       console.log("uri"+tokenmeta.data.data["uri"])
       console.log()
       // console.log(tokenmeta.data.data["uri"])
       //tokensInWallet.push({mint:mintAddress })
    
       // UpdateTheUI(mintAddress, tokenmeta.data.data["uri"], tokenmeta.data.data["name"], numberI)
      })();
    }
    
    const { publicKey, sendTransaction } = useWallet();

    async function getIfValidNfts() {

      const connection = new Connection("mainnet-beta");
      if (!publicKey) throw new WalletNotConnectedError();
      connection.getBalance(publicKey).then((bal) => {
          console.log("lamports: "+bal/LAMPORTS_PER_SOL);


      });

let publicKeyString = publicKey;
let validNftsArray = JSON.parse(JSON.stringify(validNftsA));
        const ownerPublickey = publicKey.toBase58();
        const nftsmetadata = await Metadata.findDataByOwner(connection, publicKeyString);
      
        console.log(nftsmetadata.length)
      
        let counter: number = nftsmetadata.length;
        console.log("counter: "+counter);
      
        let counterI= 0;
        let nftsThatAreValid: string[]= [];
        for (var i in nftsmetadata){
        //console.log(nftsmetadata[i].mint);

        for (var ao in validNftsArray){
          if (nftsmetadata[i].mint == validNftsArray[ao]){
            console.log("✅"+nftsmetadata[i].mint);
            nftsThatAreValid.push(nftsmetadata[i].mint+"");
          }
        } 


        counterI+=1;
        }
        if(nftsThatAreValid.length>=3){
          console.log("valid:"+nftsThatAreValid.length)
          setStatusHolder(true)
        }
      setNftsinWallet(counterI)

        let nfts_total_element = <span>({nftsThatAreValid.length})</span>;
 
        ReactDOM.render(nfts_total_element, document.getElementById("validTotalNFTs"))
    

              

    
      
    }

    const onClick = useCallback( async () => {

      if (!publicKey) throw new WalletNotConnectedError();
      connection.getBalance(publicKey).then((bal) => {
          console.log(bal/LAMPORTS_PER_SOL);

      });

      console.log(publicKey.toBase58());
      //getTheTokensOfOwner(publicKey.toBase58());
      getIfValidNfts()

  }, [publicKey, sendTransaction, connection]);

  const downloadFile = () => {
    var a = document.createElement('a');
a.href = "hello.pdf";
a.download = "hello.pdf";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

  }
   

    return (
            <div className="navbar">
  <div className="navbar-inner">
    <a className="brand" href="#">Serpent</a>
    <ul className='nav pull-right'>
    <WalletMultiButton />

    </ul>
    </div>
   <div className='container-fluid' id='nfts'>
     
       <button onClick={onClick}>get NFTs</button>
     <br></br>  <h1>NFTs in wallet <span >{nftsInWallet}</span></h1>
  

     <h1>Serpent Academy Valid NFTs <span id='validTotalNFTs'></span></h1>

<button onClick={downloadFile}  disabled={!statusHolder} >Get Book</button>
   </div>
    </div>

    );
};
