import axios from 'axios'
import chalk from 'chalk'
import { AbiCoder, ethers, JsonRpcProvider } from 'ethers'
import fs from 'fs'
import { HttpsProxyAgent } from 'hpagent'
import { banner } from './banner'
import { mix, random, sleep } from './utils'

const config = {
  RPC: 'https://base.llamarpc.com',
  sleep: [ 120, 360 ] as const, // интервал между кошельками в секундах
}

const proxies = fs.readFileSync('./proxies.txt').toString().split('\n').map(proxy => proxy.trim()).filter(Boolean)
const keys = fs.readFileSync('./keys.txt').toString().split('\n').map(key => key.trim()).filter(Boolean)

const order = mix(proxies.map((_, i) => i))
const provider = new JsonRpcProvider(config.RPC)
const abiCoder = AbiCoder.defaultAbiCoder()

const startedAt = (Date.now() / 1000).toFixed(0)

async function saveResult(address: string, status: 'minted' | 'failed' | 'skipped') {
  const file = `./results/${startedAt}-${status}.txt`
  fs.appendFileSync(file, `${address}\n`)
}

async function main() {
  banner()

  console.log()
  console.log('🔑 loaded keys:   ', keys.length)
  console.log('🫣 loaded proxies:', proxies.length)

  for (let i = 0; i < order.length; i++) {
    const index = order[i]
    const proxy = proxies[index]
    const key = keys[index]

    const signer = new ethers.Wallet(key).connect(provider)
    console.log(`\n👛 start for ${chalk.bold(signer.address)}`)

    if (!proxy) {
      console.warn(`⚠️ proxy is not defined for ${signer.address}`)
    }

    const balance = await provider.call({
      to: '0x8dc80a209a3362f0586e6c116973bb6908170c84',
      data: '0x70a08231' + abiCoder.encode([ 'address' ], [ signer.address ]).slice(2),
    })

    if (BigInt(balance) > 0) {
      console.log('🎉 already minted')
      await saveResult(signer.address, 'minted')
      continue
    }

    const transport = axios.create({
      httpsAgent: proxy ? new HttpsProxyAgent({ proxy: `http://${proxy}` }) : undefined,
      baseURL: 'https://www.base.org',
      headers: {
        'accept': '*/*',
        'accept-language': 'en',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'priority': 'u=1, i',
        'origin': 'https://www.base.org',
        'referer': 'https://www.base.org/builder-anniversary-nft',
        'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    const { data } = await transport.post('api/checkNftProof', { address: signer.address })
    if (data.result) {
      try {
        const tx = await signer.sendTransaction({
          to: '0x8dc80a209a3362f0586e6c116973bb6908170c84',
          data: '0xb77a147b' + abiCoder.encode([ 'bytes32[]' ], [ data.result ]).slice(2),
        })
        console.log(`   send tx https://basescan.org/tx/${tx.hash}`)
        await tx.wait()
        console.log('🎉 successfully minted')
        await saveResult(signer.address, 'minted')
      } catch (e) {
        console.log('😔 failed to mint', e)
        await saveResult(signer.address, 'failed')
      }
    } else {
      console.log('🙅‍♂️no nft proof')
      await saveResult(signer.address, 'skipped')
    }

    if (i < order.length - 1) {
      const timeout = random(...config.sleep)
      console.log(`   sleep for ${timeout} seconds`)
      await sleep(timeout * 1000)
    }
  }
}

main()
