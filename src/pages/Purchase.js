import React, { useState } from 'react';
import { ethers } from 'ethers'
import connectors from "../Connectors.js";
import { YINSURE_ADDRESS, YINSURE_ABI, NM_URL, TBTC_COVERAGE_ADDRESS, ERC20_PLACES } from '../config'
import { numberWithCommas } from '../utils'
import { Link } from 'react-router-dom';
import { useWeb3Context } from "web3-react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import fetch from 'node-fetch';
import Web3Utils from 'web3-utils';

export default function Purchase(props) {
  const [coverageDays, setCoverageDays] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [currency, setCurrency] = React.useState('ETH')

  function handleCoverageDaysChange(event) {
    const value = event.target.value
    if (value == '' || value == parseInt(value, 10)) {
      setCoverageDays(value)
    }
  }

  function handleAmountChange(event) {
    const re = /^\d*\.?\d*$/
    const value = event.target.value
    if (value == '' || re.test(value)) {
      setAmount(value)
    }
  }

  function handleSetETH() {
    setCurrency('ETH')
  }

  function handleSetDAI() {
    setCurrency('DAI')
  }

  return (
    <Container>
      <h2>Purchase Coverage</h2>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="30 - 365 days"
            aria-label="Coverage days"
            aria-describedby="coverage-days"
            onChange={handleCoverageDaysChange}
            value={coverageDays}
          />
          <InputGroup.Append>
            <InputGroup.Text id="coverage-days">days</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        
        <InputGroup>
          <FormControl
            placeholder="0"
            aria-label="Amount"
            aria-describedby="basic-addon2"
            onChange={handleAmountChange}
            value={amount}
          />

          <DropdownButton
            as={InputGroup.Append}
            variant="outline-secondary"
            title={currency}
            id="input-group-dropdown-2"
          >
            <Dropdown.Item onClick={handleSetETH} href="#">ETH</Dropdown.Item>
          </DropdownButton>
        </InputGroup>
        <Capacity />
        <Quote
          coverageDays={coverageDays}
          amount={amount}
          currency={currency}
        />
      </div>
    </Container>
  )
}

function Capacity(props) {
  const [daiCapacity, setDaiCapacity] = React.useState(0)
  const [ethCapacity, setEthCapacity] = React.useState(0)

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${NM_URL}/v1/capacities`)
      const json = await response.json()
      const capacity = json.find(i => i.contractAddress === TBTC_COVERAGE_ADDRESS.toLowerCase())
      setDaiCapacity(parseInt(capacity.capacityDAI / ERC20_PLACES))
      setEthCapacity(parseInt(capacity.capacityETH / ERC20_PLACES))
    }
    fetchData()
  }, [])

  return (
    <div>
      <p>Capacity: {numberWithCommas(daiCapacity)} DAI / {numberWithCommas(ethCapacity)} ETH</p>
    </div>
  )
}

function Quote(props) {
  const { active, account, library, networkId } = useWeb3Context();
  const signer = library.getSigner();
  const yinsureContract = new ethers.Contract(YINSURE_ADDRESS, YINSURE_ABI, signer);

  const [quote, setQuote] = React.useState({})
  const [buttonIsEnabled, setButtonIsEnabled] = React.useState(false)

  React.useEffect(() => {
    setButtonIsEnabled(props.coverageDays >= 30 && props.coverageDays <= 365 && props.amount > 0)
  }, [props.amount, props.currency, props.coverageDays])

  async function requestQuote() {
    setButtonIsEnabled(false)
    const response = await fetch(`${NM_URL}/v1/quote?coverAmount=${props.amount}&currency=${props.currency}&period=${props.coverageDays}&contractAddress=0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd`)
    const json = await response.json()
    //const json = {"currency":"ETH","period":"50","amount":"50","price":"355920602327173169","priceInNXM":"3452257870084029366","expiresAt":1601516079,"generatedAt":1601515778149,"contract":"0xe20a5c79b39bc8c363f0f49adcfa82c2a01ab64a","v":27,"r":"0x209cd31ef9fe92d51a37d76466b1113bfeb5e702d383fd19f30a32efd1c41ade","s":"0x6d4e270d9e798e984cf5f61a3fc4f6f42f40673088ca00d24603d5b866e50d07"}
    // let json = {"currency":"DAI","period":"30","amount":"2","price":"8542094455852156","priceInNXM":"80041487420872383","expiresAt":1601426633,"generatedAt":1601426332150,"contract":"0x9424b1412450d0f8fc2255faf6046b98213b76bd","v":28,"r":"0xaa4b19165798648294774c5597f4e1c53dcdb6131b7d2e08646170aa0c946302","s":"0x121477b8d7d598d82243e4bbfe2687ada51513ce68da783ef7a15293a98add54"}
    //const json = {"currency":"ETH","period":"50","amount":"50","price":"355920602327173169","priceInNXM":"3452257870084029366","expiresAt":1601516204,"generatedAt":1601515903517,"contract":"0x9424b1412450d0f8fc2255faf6046b98213b76bd","v":28,"r":"0xe19a6959dce33960c71d912f1cc793432d88df15187a89822ca5ff9b9cdfa18a","s":"0x3e15fc0bb838a44c37636263bcfd61a3cf5ee35c3ed0a17a2c21f493fcaac77e"}
    //const json = {"currency":"ETH","period":"50","amount":"50","price":"355920602327173169","priceInNXM":"3452257870084029366","expiresAt":1601517523,"generatedAt":1601517222567,"contract":"0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f","v":28,"r":"0x1d5590dc833740212ba80970153d4ede6cdc52c5757824771ec102cbcbe69b1a","s":"0x19b82a293d89cd10a562f59035b787841fc762fc44b6425ba68449f75a4ebd82"}
    console.log(json)
    setQuote(json)
  }

  async function purchaseCoverage() {
    console.log('purchasing coverage')
    const coverDetails = [quote.amount, quote.price, quote.priceInNXM, quote.expiresAt, quote.generatedAt]
    let sendValue = undefined
    if (quote.currency === 'ETH') {
      sendValue = quote.price
    }

    const sendSymbol = Web3Utils.asciiToHex(quote.currency) + '00'
    yinsureContract.buyCover(quote.contract, sendSymbol, coverDetails, quote.period, quote.v, quote.r, quote.s, {value: sendValue})
  }

  return (
    <div>
      <Button variant="primary" onClick={requestQuote} disabled={!buttonIsEnabled && quote !== {}}>Get Quote</Button>
      <div>
        <br/>
        { Object.keys(quote).length ? <Table bordered size="sm">
          <tbody>
            <tr>
              <td>Cover cost</td>
              <td>{quote.price / ERC20_PLACES} {quote.currency}</td>
            </tr>
            <tr>
              <td>Contract</td>
              <td>{quote.contract}</td>
            </tr>
            <tr>
              <td>Cover Amount</td>
              <td>{quote.amount} {quote.currency}</td>
            </tr>
            <tr>
              <td>Cover Period</td>
              <td>{quote.period} days</td>
            </tr>
            <tr>
              <td>Cover Expires</td>
              <td>{quote.expiresAt && (new Date(quote.expiresAt * 1000)).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table> : ''}
      </div>
      { Object.keys(quote).length ? <Button variant="primary" onClick={purchaseCoverage}>Purchase</Button> : '' }
    </div>
  )
}
