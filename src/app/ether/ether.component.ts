import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Web3Service } from '../util/web3.service';

declare let require: any;
//payment ABI
const payment_artifacts = require('../../../build/contracts/Payment.json');

@Component({
  selector: 'app-ether',
  templateUrl: './ether.component.html',
  styleUrls: ['./ether.component.css']
})
export class EtherComponent implements OnInit {
  accounts: string [];
  EtherPayment: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(
    private web3Service: Web3Service,
    private matSnackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(payment_artifacts)
      .then((EtherPaymentAbstraction) => {
        this.EtherPayment = EtherPaymentAbstraction;
        this.EtherPayment.deployed().then(deployed => {
          deployed.TransferFund({}, (err, ev) => {
            this.refreshBalance();
          })
        })
      })
  }

  watchAccount() { 
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    })
  }

  setStatus(status) {
    this.matSnackbar.open(status, null, {duration: 3000});
  }

  async refreshBalance() { 
    try {
      const deployedEtherPayment = await this.EtherPayment.deployed();
      this.model.balance = await this.web3Service.getAccountInfo(this.model.account);
    } catch (e) {
      this.setStatus('error getting balance');
    }
  }

  setAmount(e) {
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    this.model.receiver = e.target.value;
  }

  async sendCoin() {
    if (! this.EtherPayment) {
      return;
    }
    
    const amount = this.model.amount;
    const receiver = this.model.receiver;

    try {
      const deployedEtherPayment = await this.EtherPayment.deployed();
      //const transaction = await deployedEtherPayment.TransferFund.sendTransaction(receiver, amount, {from: this.model.account});
      const unlocked = await this.web3Service.unlockAccount(this.model.account, "Infrabel,123", 15000);
      let transaction;
      if(unlocked) {
        transaction = await deployedEtherPayment.transferFund.sendTransaction(receiver, { from: this.model.account ,
                                                                                              value: amount});
      }

      if(! transaction) {
        this.setStatus('tx failed');
      } else {
        this.setStatus('tx complete');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('error sending tx');
    }
  }

}
