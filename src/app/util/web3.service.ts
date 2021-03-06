import {Injectable} from '@angular/core';
import contract from 'truffle-contract';
import {Subject } from 'rxjs';
declare let require: any;
const Web3 = require('web3');


declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      //turn this on for ganache
      //this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      //this.web3 = new Web3(new Web3.providers.HttpProvider('http://ethfm75y3-dns-reg1.westeurope.cloudapp.azure.com:8540'));
      //turn this on for azure POW
      //this.web3 = new Web3(new Web3.providers.HttpProvider('http://infu2i-dns-reg1.westeurope.cloudapp.azure.com:8545'));
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://infi24-dns-reg1.westeurope.cloudapp.azure.com:8545'));
    }

    //this.web3.personal.unlockAccount('');

    setInterval(() => this.refreshAccounts(), 100);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      //console.log('Refreshing accounts');
      if (err != null) {
        console.log(err);
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.ready = true;
    });
  } 

  public getAccountInfo(acc: any) {
    return this.web3.eth.getBalance(acc, (err, bal) => {
      if(err != null)
        console.log('error: could not grab balance');
      return bal;
    });
  }

  public unlockAccount(acc, pw, time) {
    console.log(this.web3.eth.personal);
    return this.web3.eth.personal.unlockAccount(acc, pw, time);
  }
}
