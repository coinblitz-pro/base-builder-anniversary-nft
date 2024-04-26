import chalk from 'chalk'
import gradient from 'gradient-string'

export function banner() {
  process.stdout.write(
    gradient('#00C9FF', '#92FE9D')('\n' +
      '                         88               88           88  88\n' +
      '                         ""               88           88  ""    ,d\n' +
      '                                          88           88        88\n' +
      ' ,adPPYba,   ,adPPYba,   88  8b,dPPYba,   88,dPPYba,   88  88  888888   888888888       8b,dPPYba,   8b,dPPYba,   ,adPPYba,\n' +
      'a8"     ""  a8"     "8a  88  88P\'   `"8a  88P\'    "8a  88  88    88          a8P"       88P\'    "8a  88P\'   "Y8  a8"     "8a\n' +
      '8b          8b       d8  88  88       88  88       d8  88  88    88       ,d8P\'         88       d8  88          8b       d8\n' +
      '"8a,   ,aa  "8a,   ,a8"  88  88       88  88b,   ,a8"  88  88    88,    ,d8"       888  88b,   ,a8"  88          "8a,   ,a8"\n' +
      ' `"Ybbd8"\'   `"YbbdP"\'   88  88       88  8Y"Ybbd8"\'   88  88    "Y888  888888888  888  88`YbbdP"\'   88           `"YbbdP"\'\n' +
      '                                                                                        88\n' +
      '                                                                                        88',
    ),
  )
  process.stdout.write(
    `           ${chalk.hex('#444956')('https://t.me/coinblitz')}`,
  )
}
