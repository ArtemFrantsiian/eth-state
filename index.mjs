import { Trie } from '@ethereumjs/trie'
import { Address, Account, bufferToHex } from '@ethereumjs/util'
import { RLP } from '@ethereumjs/rlp'
import { Chain, Common } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { VM } from '@ethereumjs/vm'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { performance } from 'perf_hooks';
import { Level } from 'level'
import { DefaultStateManager } from "@ethereumjs/statemanager";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const ENCODING_OPTS = { keyEncoding: 'buffer', valueEncoding: 'buffer' }

class LevelDB {
  _leveldb

  constructor(leveldb) {
    this._leveldb = leveldb
  }

  async get(key) {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
        throw error
    }
    return value
  }

  async put(key, val) {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  async del(key) {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack) {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy() {
    return new LevelDB(this._leveldb)
  }
}
const dbpath = path.join(__dirname, './chaindata/');
console.log('hi', dbpath);
try {
  const trie = new Trie({ db: new LevelDB(new Level(dbpath)) })
  const common = new Common({ chain: Chain.Mainnet })
  const state = new DefaultStateManager({ trie })

  const vm = await VM.create({ common, stateManager: state })

  console.log('finish');
  // vitalik.eth
  console.log(await trie.root());
} catch (e) {
  console.log(e);
}
// const bufferedTx = Buffer.from('02f9021a01808459682f008509d5bc07de8302c0d29468b3465833fb72a70ecdf485e0e4c7bd8665fc4588013fbe85edc90000b901a45ae401dc000000000000000000000000000000000000000000000000000000006376596b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000013fbe85edc900000000000000000000000000000000000000000000000000328c7ac2a069c59f670000000000000000000000000000000000000000000000000000000000000080000000000000000000000000fe00a53369700ab12da62831c6c1cd1d0f7d3f440000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000517ab044bda9629e785657dbbcae95c40c8f452c00000000000000000000000000000000000000000000000000000000c001a05849bb5ce4322af8683f88264bdd5399e32736c66dc0605089cad71877de0f88a06cd1984913671926ceb96ca014251d9071e96bc29a5d2dbb82dff3b66df072ca', 'hex');
// const tx = FeeMarketEIP1559Transaction.fromSerializedTx(
//   bufferedTx,
//   { common }
// )

// const endTime = performance.now()
//
// console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

// async function main() {
//   try {
//     const address = new Address(Buffer.from('0xfe00a53369700ab12da62831c6c1cd1d0f7d3f44'.slice(2), 'hex'));
//     const res = await state.getAccount(address);
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }
//   //   const startTime = performance.now()
//   //   await vm.runTx({
//   //     skipBalance: false,
//   //     skipNonce: false,
//   //     tx,
//   //   })
//   //   const endTime = performance.now()
//   //   console.log(`Run transaction on empty state took ${endTime - startTime} milliseconds`)
//   //   const startTime2 = performance.now()
//   //   await vm.runTx({
//   //     skipBalance: true,
//   //     skipNonce: true,
//   //     tx,
//   //   })
//   //   const endTime2 = performance.now()
//   //   console.log(`Run transaction on cached state took took ${endTime2 - startTime2} milliseconds`)
//   //   // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
//   // } catch (e) {
//   //   console.log(e);
//   //   // const endTime = performance.now()
//   //
//   //   // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
//   // }
// }
//
// main();

// // Set stateRoot to block #222
// const stateRoot = '0xa4c9f9ac0e25f98e82cd1c29faf0b192790751c777845fecd4704442c0cb1522'
// // Convert the state root to a Buffer (strip the 0x prefix)
// const stateRootBuffer = Buffer.from(stateRoot.slice(2), 'hex')
// // Initialize trie
// const trie = new Trie({
//   root: stateRootBuffer,
//   useKeyHashing: true,
// })
//
// console.log({trie});
// const address = new Address(Buffer.from('0x04192b74807F697c4e78f4EA1c727f2BfCbfbC04'.slice(2), 'hex'));
//
// async function test() {
//   const data = await trie.get(address)
//   console.log({data});
//   const acc = Account.fromAccountData(data)
//
//   console.log('-------State-------')
//   console.log(`nonce: ${acc.nonce}`)
//   console.log(`balance in wei: ${acc.balance}`)
//   console.log(`storageRoot: ${bufferToHex(acc.stateRoot)}`)
//   console.log(`codeHash: ${bufferToHex(acc.codeHash)}`)
//
//   const storageTrie = trie.copy()
//   storageTrie.root(acc.stateRoot)
//
//   console.log('------Storage------')
//   const stream = storageTrie.createReadStream()
//   stream
//     .on('data', (data) => {
//       console.log(`key: ${bufferToHex(data.key)}`)
//       console.log(`Value: ${bufferToHex(Buffer.from(RLP.decode(data.value)))}`)
//     })
//     .on('end', () => console.log('Finished reading storage.'))
// }
//
// test()