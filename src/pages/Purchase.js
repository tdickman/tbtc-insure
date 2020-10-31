import React, { useState } from 'react';
import { ethers } from 'ethers'
import connectors from "../Connectors.js";
import { YINSURE_ADDRESS, YINSURE_ABI, NM_URL, NM_API_KEY, TBTC_COVERAGE_ADDRESS, ERC20_PLACES } from '../config'
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
      const response = await fetch(`${NM_URL}/v1/capacities`, {headers: {'x-api-key': NM_API_KEY}})
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
    const response = await fetch(`${NM_URL}/v1/quote?coverAmount=${props.amount}&currency=${props.currency}&period=${props.coverageDays}&contractAddress=${TBTC_COVERAGE_ADDRESS}`, {headers: {'x-api-key': NM_API_KEY}})
    const json = await response.json()
    // Use workaround to calculate expiration since expiresAt is invalid
    var date = new Date()
    date.setDate(date.getDate() + parseInt(props.coverageDays))
    json.expiresAtCorrected = date.toString()
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
              <td>{quote.expiresAtCorrected}</td>
            </tr>
          </tbody>
        </Table> : ''}
      </div>
      { Object.keys(quote).length ? <Button variant="primary" onClick={purchaseCoverage}>Purchase</Button> : '' }
    </div>
  )
}
