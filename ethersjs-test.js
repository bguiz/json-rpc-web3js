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

    // reduced polling interval
    // RSK needs half as frequent frequent polling,
    // default of 4s is based on Ethereum
    provider.pollingInterval = 8e3;

    // workaround for invalid transaction receipt
    // Ref: https://github.com/ethers-io/ethers.js/pull/952
    const formats =
      provider.formatter && provider.formatter.formats;
    if (formats && formats.receipt) {
      formats.receipt.root = formats.receipt.logsBloom;
      Object.assign(provider.formatter, { formats });
    }
  });

  it('should get chainId', async () => {
    const chainIdResponse = await provider.send(
      'eth_chainId', []);
    console.log({ chainIdResponse });
    const chainId = parseInt(chainIdResponse, 0x10);
    assert.strictEqual(typeof chainId, 'number');
    assert.strictEqual(chainId, 33);
  });

  let prevBlockNumber;
  it('should get a block number', async () => {
    const blockNumber = await provider.getBlockNumber();
    console.log({ blockNumber });
    assert.strictEqual(typeof blockNumber, 'number');
    assert.isAbove(blockNumber, 0);
    prevBlockNumber = blockNumber;
  });

  it('should force blocks to be mined immediately', async () => {
    for (let i = 0; i < 5; ++i) {
      await mine();
    }
    const blockNumber = await provider.getBlockNumber();
    console.log({ blockNumber });
    assert.strictEqual(typeof blockNumber, 'number');
    assert.isAbove(blockNumber, prevBlockNumber + 4);
  });
});
