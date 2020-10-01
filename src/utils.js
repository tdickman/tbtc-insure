export function getEtherscanUrl(transactionHash, networkId) {
  if (networkId == 3) {
    return `https://ropsten.etherscan.io/tx/${transactionHash}`
  }
  return `https://etherscan.io/tx/${transactionHash}`
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
