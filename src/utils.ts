export function mix<T extends any[]>(arr: Readonly<T>) {
  const mixed = [ ...arr ] as T
  for (let i = mixed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ mixed[i], mixed[j] ] = [ mixed[j], mixed[i] ]
  }
  return mixed
}


export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
