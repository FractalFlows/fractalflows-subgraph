# Fractal Flows Subgraph

## Run locally

```bash
$ npm i -g ipfs
$ jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]' # allow CORS requests
$ jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
$ jsipfs daemon # start IPFS node
```

```bash
$ git clone https://github.com/graphprotocol/graph-node.git
$ cd graph-node
$ GRAPH_ALLOW_NON_DETERMINISTIC_IPFS=true cargo run -p graph-node --release -- \
 --postgres-url postgresql://{DB_USERNAME}:{DB_PSWD}@localhost:5432/fractalflows_subgraph \
 --ethereum-rpc {ETHEREUM_NETWORK_NAME}:{PROVIDER_URL} \
 --ipfs {IPFS_NODE_URL} \
 --debug # start Graph Node
```

```bash
$ yarn create-local
$ yarn deploy-local # use --watch flag to restart node everytime manifest, schema or mappings are changed
```

More information:

https://github.com/graphprotocol/graph-node#running-a-local-graph-node

https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md#23-starting-the-graph-node-and-connecting-to-an-etheruem-node
