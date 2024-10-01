import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Designer from "../public/Designer.jpeg";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PublicKey } from "@solana/web3.js"; // Import PublicKey here
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function App() {
  const [nfts, setNfts] = useState([]);
  const [network, setNetwork] = useState("https://devnet.helius-rpc.com/?api-key=29cb671e-14ef-44f3-822e-092567b3e181");
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (wallet.publicKey) {
      fetchNFTs(wallet.publicKey);
    }
  }, [wallet.publicKey]);

  const fetchNFTs = async (publicKey) => {
    try {
      const umi = createUmi(clusterApiUrl("devnet"));

      // Use PublicKey from @solana/web3.js
      const ownerPublicKey = new PublicKey("A96t1F3Bn8acyiwn5JFp9Zh3UUPGLhXCZRYqLDbxrcC2");
      
      console.log("Fetching NFTs...");
      const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(umi, ownerPublicKey);
      // const response = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
      //   programId: TOKEN_PROGRAM_ID,
      // });
      
      // console.log(response);
      console.log(`Found ${allNFTs.length} NFTs for the owner: ${ownerPublicKey}`);
      allNFTs.forEach((nft, index) => {
        console.log(`\nNFT #${index + 1}:`);
        console.log("Mint Address:", nft.publicKey);
        console.log("Name:", nft.metadata.name);
        console.log("Symbol:", nft.metadata.symbol);
        console.log("URI:", nft.metadata.uri);
      });

      setNfts(allNFTs); 

    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-6 fixed top-0 w-full bg-stone-900 text-white z-50">
        <a href="/" className="text-3xl font-bold cursor-pointer">
          TanXGenesis
        </a>
        <div className="flex items-center space-x-6 font-bold">
          <button className="hover:text-blue-400">Home</button>
          <button className="hover:text-blue-400">Tools</button>
          <button className="hover:text-blue-400">Buy me a Coffee</button>
          <button className="hover:text-blue-400">FAQ</button>
        </div>
        <div className="flex items-center space-x-6">
          <select
            className="bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="network"
            id="network"
            value={network}
            onChange={handleNetworkChange}
          >
            <option value="https://api.mainnet-beta.solana.com">Mainnet</option>
            <option value="https://api.devnet.solana.com">Devnet</option>
            <option value="https://api.testnet.solana.com">TestNet</option>
          </select>
          <WalletMultiButton />
        </div>
      </nav>

      <div className="h-screen w-full bg-stone-950 flex px-20 gap-8 pt-20">
        <div className="h-full w-3/5 flex flex-col justify-center space-y-8">
          <h1 className="text-4xl font-bold text-white">Create, Buy, and Sell Your Own NFTs</h1>
          <p className="text-lg text-gray-300">
            TanXGenesis provides you with the tools to easily create your own NFTs, buy NFTs from other creators, and
            list your NFTs for sale on the platform. Seamlessly interact with the Solana blockchain and explore a world
            of digital assets at your fingertips.
          </p>
          <ul className="text-lg text-gray-400 list-disc ml-6">
            <li>Create and mint your own unique NFTs with just a few clicks.</li>
            <li>Browse and purchase NFTs listed by other users.</li>
            <li>List your NFTs for sale and manage your listings.</li>
          </ul>
          <button className="mt-6 py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-500 w-40">
            Get Started
          </button>
        </div>

        <div className="h-full w-2/5 flex flex-col justify-center">
          <img src={Designer} alt="TanXGenesis" className="rounded-md" />
        </div>
      </div>

      <div className="w-full px-20 py-8 bg-stone-950">
        <h1 className="text-4xl font-bold text-white mb-8">Your NFTs</h1>
        {nfts.length === 0 ? (
          <p className="text-lg text-gray-400">You don't have any NFTs yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {nfts.map((nft, index) => (
              <div key={index} className="bg-stone-800 p-4 rounded-lg">
                <img src={nft.metadata.uri} alt={nft.metadata.name} className="rounded-md mb-4" />
                <h2 className="text-white text-lg">{nft.metadata.name}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
