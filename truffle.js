var HDWalletProvider = require("truffle-hdwallet-provider");

//var rpc_endpoint = "http://ethfm75y3-dns-reg1.westeurope.cloudapp.azure.com:8540";
//var rpc_endpoint = "http://infu2i-dns-reg1.westeurope.cloudapp.azure.com:8545";
var rpc_endpoint = "http://infi24-dns-reg1.westeurope.cloudapp.azure.com:8545";
var rpc_endpoint_p = "http://infu2i-dns-reg1.westeurope.cloudapp.azure.com";
var mnemonic = "fox royal prison raise portion defy fire antique found achieve canal mean";

module.exports = {
    networks: {
         development: {
              host: "localhost",
              port: 8545,
              network_id: "*" // Match any network id
            },
          azure: {
               host: rpc_endpoint_p,
               port: 8545,
               network_id: 10101010
          },
          poa: {
               provider: new HDWalletProvider(mnemonic, rpc_endpoint),
               network_id: 10101010,
               gasPrice: 0
          },
          pow: {
               provider: () => new HDWalletProvider(mnemonic, rpc_endpoint),
               network_id: 10101010,
               gasPrice: 0,
               gas: 4600000
          }
       }
};
