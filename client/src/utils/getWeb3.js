import Web3 from 'web3';
const FALLBACK_WEB3_PROVIDER = process.env.REACT_APP_NETWORK || 'https://mainnet.infura.io/v3/05cafed4c55443a9979c110ce1d8f186';

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        
        await window.ethereum.send('eth_requestAccounts');
    
        const web3 = new Web3(window.ethereum);

        console.log('Using window web3');
        console.log(web3);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3.currentProvider;
        console.log('Injected web3 detected.');
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(FALLBACK_WEB3_PROVIDER);
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Infura/Local web3.');
        resolve(web3);
      }
    });
  });

const getGanacheWeb3 = () => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    return null;
  }
  const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/05cafed4c55443a9979c110ce1d8f186');
  const web3 = new Web3(provider);
  console.log('No local ganache found.');
  return web3;
};

export default getWeb3;
export { getGanacheWeb3 };
