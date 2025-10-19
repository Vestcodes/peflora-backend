import { spawn } from 'node:child_process'
import axios from 'axios'
import products from './products.json'

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
}

const formatColor = (color: string, text: string) => `${color}${text}${COLORS.RESET}`
const formatBold = (text: string) => `${COLORS.BOLD}${text}${COLORS.RESET}`
const formatGreen = (text) => `${COLORS.GREEN}${text}${COLORS.RESET}`
const formatYellow = (text: string) => `${COLORS.YELLOW}${text}${COLORS.RESET}`
const formatBlue = (text: string) => `${COLORS.BLUE}${text}${COLORS.RESET}`
const formatMagenta = (text: string) => `${COLORS.MAGENTA}${text}${COLORS.RESET}`
const formatCyan = (text: string) => `${COLORS.CYAN}${text}${COLORS.RESET}`

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function formatProductForApi(product: typeof products[number]) {
  return {
    
  }
}

async function checkIfServerIsRunning() {
  try {
    console.log('🔄 Checking if server is running...')
    const res = await axios.get('http://localhost:9000/health')
    console.log('🔄 Server is running:', res.data?.status)
    return res.status === 200
  } catch {
    console.log('🔄 Server is not running')
    return false
  }
}

async function login() {
  console.log('🔄 Logging in...')
  const login = await axios.post('http://localhost:9000/auth/user/emailpass', {
    email: 'contact@vestcodes.co',
    password: 'Sarwagya@07',
  })
  return login.data.token;
}



async function main() {
  console.log('🧱 Building...')

  const build = spawn('npm', ['run', 'build'])

  build.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Build failed with code ${code}`)
      process.exit(1)
    }

    console.log('🚀 Starting server...')
    const server = spawn('npm', ['run', 'start'])

    ;(async () => {
      let ready = false
      while (!ready) {
        ready = await checkIfServerIsRunning()
        if (!ready) {
          console.log('🔄 Waiting for server to start...')
          await sleep(1000)
        }
      }

      console.log('✅ Server is running!')
      console.log('🚀 Running product setup...')
      const token = await login()
      console.log('🔄 Token:', formatBold(formatYellow(token)))

      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping server...')
        server.kill('SIGINT')
        process.exit(0)
      })
    })()
  })
}

main()
