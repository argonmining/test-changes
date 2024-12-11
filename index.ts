import { RpcClient, Resolver } from "./wasm/kaspa"
import Treasury from "./src/treasury"
import Templates from "./src/templates"
import Stratum from "./src/stratum"
import Pool from "./src/pool"

import config from "./config.json"

const rpc = new RpcClient({
  resolver: new Resolver(),
  networkId: 'testnet-11'
})
await rpc.connect()

const serverInfo = await rpc.getServerInfo()
if (!serverInfo.isSynced || !serverInfo.hasUtxoIndex) throw Error('Provided node is either not synchronized or lacks the UTXO index.')

const treasury = new Treasury(rpc, serverInfo.networkId, config.treasury.privateKey, config.treasury.fee)
const templates = new Templates(rpc, treasury.address, config.templates.identity, config.templates.daaWindow)
const stratum = new Stratum(templates, config.stratum.hostName, config.stratum.port, config.stratum.difficulty)

new Pool(treasury, stratum, config.treasury.rewarding.paymentThreshold)
