const {
  ethers
} = require('ethers');
const assert = require('chai').assert;

describe(`Rskj ethers.js Smoke Tests`, function () {
  this.timeout(15e3);

  let rpcUrl;
  let chainName;
  let chainId;
  let provider;
  let signer;
  let mine;

  before(async () => {
    rpcUrl = 'http://127.0.0.1:4444';
    chainName = 'rsk_regtest';
    chainId = 33;

    provider = new ethers.providers.JsonRpcProvider(
      rpcUrl,
      {
        name: chainName,
        chainId,
      },
    );
    signer = provider.getSigner(0);
    mine = (() => provider.send('evm_mine'));
  });
});
