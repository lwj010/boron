import React, { Component } from 'react';
import styles from './UnhealthyAccounts.module.scss';
import getWeb3 from '../../utils/getWeb3';

import CBATABI from '../../abis/cbat.json';
import CCOMPABI from '../../abis/ccomp.json';
import CDAIABI from '../../abis/cdai.json';
import CETHABI from '../../abis/ceth.json';
import CREPABI from '../../abis/crep.json';
import CSAIABI from '../../abis/csai.json';
import CUNIABI from '../../abis/cuni.json';
import CUSDCABI from '../../abis/cusdc.json';
import CUSDTABI from '../../abis/cusdt.json';
import CWBTCABI from '../../abis/cwbtc.json';
import CWBTC2ABI from '../../abis/cwbtc2.json';
import CZRXABI from '../../abis/czrx.json';


export default class UnhealthyAccounts extends Component {

  state = {
      showUsd: true,
      // TODO: Get price from oracle.
      gasPrice: 10,
      ethToUsd: 3000.77,
    };

    // TODO: function binding

    // Prices are in USD ($).
    // TODO: Put this in IndexedDB.
    // TODO: Get prices from oracles.
    tokenMap = {
      '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e': {
        symbol: 'cBAT',
        decimals: 18,
        price: 20.0039,
        underlyingAssetToEthExchangeRate: 0.001297,
        abi: CBATABI,
      },
      '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4': {
        symbol: 'cCOMP',
        decimals: 18,
        price: 60.0039,
        underlyingAssetToEthExchangeRate: 0.001297,
        abi: CCOMPABI,
      },
      '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643': {
        symbol: 'cDAI',
        decimals: 18,
        price: 1.0000,
        underlyingAssetToEthExchangeRate: 0.007071,
        abi: CDAIABI,
      },
      '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5': {
        symbol: 'cETH',
        decimals: 18,
        price: 300.0154,
        underlyingAssetToEthExchangeRate: 1,
        abi: CETHABI,
      },
      '0x158079ee67fce2f58472a96584a73c7ab9ac95c1': {
        symbol: 'cREP',
        decimals: 18,
        price: 3.2126,
        underlyingAssetToEthExchangeRate: 0.070744,
        abi: CREPABI,
      },
      '0xf5dce57282a584d2746faf1593d3121fcac444dc': {
        symbol: 'cSAI',
        decimals: 18,
        price: 1.0211,
        underlyingAssetToEthExchangeRate: 0.007129,
        abi: CSAIABI,
      },
      '0x35a18000230da775cac24873d00ff85bccded550': {
        symbol: 'cUNI',
        decimals: 18,
        price: 25.0211,
        underlyingAssetToEthExchangeRate: 0.007129,
        abi: CUNIABI,
      },
      '0x39aa39c021dfbae8fac545936693ac917d5e7563': {
        symbol: 'cUSDC',
        decimals: 6,
        price: 1,
        underlyingAssetToEthExchangeRate: 0.007067,
        abi: CUSDCABI,
      },
      '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9': {
        symbol: 'cUSDT',
        decimals: 6,
        price: 1,
        underlyingAssetToEthExchangeRate: 0.007067,
        abi: CUSDTABI,
      },
      '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4': {
        symbol: 'cWBTC',
        decimals: 8,
        price: 1000.3473,
        underlyingAssetToEthExchangeRate: 50.753489,
        abi: CWBTCABI,
      },
      '0xccf4429db6322d5c611ee964527d42e5d685dd6a': {
        symbol: 'cWBTC2',
        decimals: 8,
        price: 1000.3473,
        underlyingAssetToEthExchangeRate: 50.753489,
        abi: CWBTC2ABI,
      },
      '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407': {
        symbol: 'cZRX',
        decimals: 18,
        price: 1,
        underlyingAssetToEthExchangeRate: 0.001524,
        abi: CZRXABI,
      },
    };
  

  async componentDidMount() {
    const web3 = await getWeb3();
    this.setState({
      web3: web3,
      // Fast option on ETH Gas Station.
      // TODO: set gasprice: 1 for convenience. should change it to current price level. 
      gasPrice: 1, // new web3.utils.BN(13.2 * 10**9),
      currencySymbol: this.state.showUsd ? '$' : 'Ξ',
      closeFactor : 0.05,
    });
    await this.loadTokenContracts();
    await this.loadUnhealthyAccounts();
  }

  async loadTokenContracts() {
    for (const [tokenAddress, token] of Object.entries(this.tokenMap)) {
      token.contract = new this.state.web3.eth.Contract(token.abi, tokenAddress);
    }
  }

  async loadUnhealthyAccounts() {
    let url = new URL('https://api.compound.finance/api/v2/account');
    let params = {
      "max_health[value]": "1.0",
      "page_size": 100,
    };
    url.search = new URLSearchParams(params).toString();
    try {
      // Call the fetch function passing the url of the API as a parameter
      let response = await fetch(url);
      // Your code for handling the data you get from the API
      let data = await response.json();
      
      //console.log(data)
      // TODO: data cleaning
      let size = Object.keys(data.accounts).length;
      
      // TODO: this is a problem. Why 0 is not assinging to 'data' variable?
      /*
      for(let i=0; i < size; i++){
        if(isNaN(data.accounts[i].max_liquidation_value_in_eth)) {  
          data.accounts[i].max_liquidation_value_in_eth = 0;
        
        }
        if(isNaN(data.accounts[i].max_liquidation_value_in_usd)) {
          data.accounts[i].max_liquidation_value_in_usd = 0;
        
        }
      }
      console.log(data);
      */
      

      data.accounts.forEach(account => {

        //TODO: 전반적으로 Nan 처리 한번 해줘야 함. undefined 된것들 많음. 
        account.debt = [];
        account.collateral = [];
        account.total_borrow_value_in_eth.value = Number(account.total_borrow_value_in_eth.value);
        // console.log(account.total_borrow_value_in_eth.value);

        account.total_borrow_value_in_usd = {value : 0};
        

        account.total_borrow_value_in_usd.value = Number(account.total_borrow_value_in_eth.value) * this.state.ethToUsd;
        // console.log(account.total_borrow_value_in_usd.value.toFixed(8));
        account.max_liquidation_value_in_eth = Number(account.total_borrow_value_in_eth.value) * this.state.closeFactor;
        account.max_liquidation_value_in_usd = Number(account.max_liquidation_value_in_eth) * this.state.ethToUsd;
        account.total_collateral_value_in_eth.value = Number(account.total_collateral_value_in_eth.value);

        account.total_collateral_value_in_usd = {value : 0};

        account.total_collateral_value_in_usd.value = Number(account.total_collateral_value_in_eth.value) * this.state.ethToUsd;
        account.total_debt_in_eth = 0;
        account.total_supply_in_eth = 0;

        account.health = Number(account.health);

        account.tokens.forEach(token => {
        
          token.symbol = this.tokenMap[token.address].symbol;
          token.decimals = this.tokenMap[token.address].decimals;
          token.price = this.tokenMap[token.address].price;
          token.contract = this.tokenMap[token.address].contract;
          token.underlyingAssetToEthExchangeRate = this.tokenMap[token.address].underlyingAssetToEthExchangeRate;
          token.borrow_balance_underlying = parseFloat(token.borrow_balance_underlying.value);
          token.borrow_balance_underlying_in_eth = token.borrow_balance_underlying * this.tokenMap[token.address].underlyingAssetToEthExchangeRate;
          token.borrow_balance_underlying_in_usd = token.borrow_balance_underlying_in_eth * this.state.ethToUsd;
          account.total_debt_in_eth += token.borrow_balance_underlying_in_eth;
          token.supply_balance_underlying = parseFloat(token.supply_balance_underlying.value);
          token.supply_balance_underlying_in_eth = token.supply_balance_underlying * this.tokenMap[token.address].underlyingAssetToEthExchangeRate;
          token.supply_balance_underlying_in_usd = token.supply_balance_underlying_in_eth * this.state.ethToUsd;
          account.total_supply_in_eth += token.supply_balance_underlying_in_eth;
          // if (token.borrow_balance_underlying > 0) {
            account.debt.push(token);
          // }
          // if (token.supply_balance_underlying > 0) {
            account.collateral.push(token);
          // }
        });
        account.total_debt_in_usd = account.total_debt_in_eth * this.state.ethToUsd;
        account.total_supply_in_usd = account.total_supply_in_eth * this.state.ethToUsd;
        account.debt.sort((a, b) => b.borrow_balance_underlying_in_eth - a.borrow_balance_underlying_in_eth);
        account.collateral.sort((a, b) => b.supply_balance_underlying_in_eth - a.supply_balance_underlying_in_eth);
      });
      data.accounts.sort((a, b) => b.total_borrow_value_in_eth - a.total_borrow_value_in_eth);
      for (const account of data.accounts) {
        const liquidationAmount = account.max_liquidation_value_in_eth / account.debt[0].underlyingAssetToEthExchangeRate;
        const seizeAmount = account.max_liquidation_value_in_eth * data.liquidation_incentive / account.collateral[0].underlyingAssetToEthExchangeRate;
        //console.log(account);
        account.transactions = [];

        account.transactions.push(`Liquidate ${liquidationAmount.toFixed(8)} ${account.debt[0].symbol.substring(1)}, ${this.state.currencySymbol}${(account.max_liquidation_value_in_eth * (this.state.showUsd ? this.state.ethToUsd : 1)).toFixed(8)} debt`)
        account.transactions.push(`Collect ${seizeAmount.toFixed(8)} ${account.collateral[0].symbol.substring(1)}, ${this.state.currencySymbol}${(account.max_liquidation_value_in_eth * (this.state.showUsd ? this.state.ethToUsd : 1) * data.liquidation_incentive).toFixed(8)} collateral`)
        const expectedCollateral = account.max_liquidation_value_in_eth * data.liquidation_incentive;
        const actualCollateral = account.collateral[0].supply_balance_underlying_in_eth;
        if (expectedCollateral > actualCollateral) {
          account.transactions.push('Insufficient collateral.')
          continue;
        }
        let expectedGasAmount = 0;
        /* [TODO] Should remove comment later.
        if (account.debt[0].symbol === 'cETH') {
          expectedGasAmount = await account.debt[0].contract.methods.liquidateBorrow(account.address, account.collateral[0].address).estimateGas({gas: 5000000000, value: (liquidationAmount * 10**account.debt[0].decimals).toFixed(0)});
        } else {
          expectedGasAmount = await account.debt[0].contract.methods.liquidateBorrow(account.address, (liquidationAmount * 10**account.debt[0].decimals).toFixed(0), account.collateral[0].address).estimateGas({gas: 5000000000});
        }
        */

        /*[TODO]: Gas fee adjustment*/
        // const expectedGasFee = this.state.web3.utils.fromWei(this.state.gasPrice.mul(this.state.web3.utils.toBN(expectedGasAmount)));
        const expectedGasFee = 400000;
        account.transactions.push(`Gas Amount = ${expectedGasAmount}, Gas Fee = ${this.state.currencySymbol}${(expectedGasFee * (this.state.showUsd ? this.state.ethToUsd : 1)).toFixed(8)}`);
      
        const expectedRevenue = (seizeAmount * account.collateral[0].underlyingAssetToEthExchangeRate) - (liquidationAmount * account.debt[0].underlyingAssetToEthExchangeRate);
        account.transactions.push(`Expected Revenue = ${this.state.currencySymbol}${(expectedRevenue * (this.state.showUsd ? this.state.ethToUsd : 1)).toFixed(8)}`);
        const expectedProfit = expectedRevenue - expectedGasFee;
        account.transactions.push(`Expected Profit = ${this.state.currencySymbol}${(expectedProfit * (this.state.showUsd ? this.state.ethToUsd : 1)).toFixed(8)}`);
      }
      this.setState({
        accountResponse: data,
      });
    }
    catch (e) {
      // This is where you run code if the server returns any errors
      console.log(e);
    }
  }

  renderUnhealthyAccounts() {
    console.log(this.state.accountResponse);
    if (this.state.accountResponse) {
      return (
        <div className={styles.instructions}>
          <h1> Browse Unhealthy Accounts </h1>
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th align="right">Health</th>
                <th align="right">Borrow Value ({this.state.currencySymbol})</th>
                <th align="right">Max Liquidation Amount ({this.state.currencySymbol})</th>
                <th align="right">Debt</th>
                <th align="right">Debt ({this.state.currencySymbol})</th>
                <th align="right">Collateral Value ({this.state.currencySymbol})</th>
                <th align="right">Collateral</th>
                <th align="right">Collateral ({this.state.currencySymbol})</th>
                <th>Expected Transaction</th>
              </tr>
            </thead>
            <tbody>
              {this.state.accountResponse.accounts.map((account) => {
                
                console.log(account);
                return (
                  <tr key={account.address}>
                    <td>{account.address}</td>
                    {/* If account.health.value returns NaN, set 0 for that account  */}
                    <td align="right">{account.health.value ? account.health.value.toFixed(8) : 0}</td>
                    <td align="right">{this.state.showUsd ? account.total_borrow_value_in_usd.value.toFixed(8) : account.total_borrow_value_in_eth.value.toFixed(8)}</td>
                    <td align="right">{this.state.showUsd ? account.max_liquidation_value_in_usd.toFixed(8) : account.max_liquidation_value_in_eth.toFixed(8) }</td>
                    <td align="right">
                      <ul>
                        {(account.debt.map((token) => {
                          return (
                            <li key={token.address}>{token.symbol.substring(1) + ": " + token.borrow_balance_underlying.toFixed(8)}</li>
                          );
                        }))}
                      </ul>
                    </td>
                    <td align="right">
                      <ul>
                        {(account.debt.map((token) => {
                          return (
                            <li key={token.address}>{token.symbol.substring(1)}: {this.state.showUsd ? token.borrow_balance_underlying_in_usd.toFixed(8) : token.borrow_balance_underlying_in_eth.toFixed(8)}</li>
                          );
                        }))}
                        <li>Total: {this.state.showUsd ? account.total_debt_in_usd.toFixed(8) : account.total_debt_in_eth.toFixed(8)}</li>
                      </ul>
                    </td>
                    <td align="right">{(this.state.showUsd ? account.total_collateral_value_in_usd.value : account.total_collateral_value_in_eth.value).toFixed(8)}</td>
                    <td align="right">
                      <ul>
                        {(account.collateral.map((token) => {
                          return (
                            <li key={token.address}>{token.symbol.substring(1) + ": " + token.supply_balance_underlying.toFixed(8)}</li>
                          );
                        }))}
                      </ul>
                    </td>
                    <td align="right">
                      <ul>
                        {(account.collateral.map((token) => {
                          return (
                            <li key={token.address}>{token.symbol.substring(1)}: {this.state.showUsd ? token.supply_balance_underlying_in_usd.toFixed(8) : token.supply_balance_underlying_in_eth.toFixed(8)}</li>
                          );
                        }))}
                        <li>Total: {this.state.showUsd ? account.total_supply_in_usd.toFixed(8) : account.total_supply_in_eth.toFixed(8)}</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {(account.transactions.map((tx, i) => {
                          return (
                            <li key={i}>{tx}</li>
                          );
                        }))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className={styles.instructions}>
        <h1> Browse Unhealthy Accounts </h1>
      </div>
    );
  }

  render() {
    return this.renderUnhealthyAccounts();
  }
}
