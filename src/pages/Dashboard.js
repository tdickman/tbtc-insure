import React, { useState } from 'react';
import { ethers } from 'ethers'
import connectors from "../Connectors.js";
import { YINSURE_ADDRESS, YINSURE_ABI, QUOTATION_ADDRESS, QUOTATION_ABI } from '../config'
import { numberWithCommas } from '../utils'
import { Link } from 'react-router-dom';
import { useWeb3Context } from "web3-react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import fetch from 'node-fetch';

export default function Dashboard(props) {
  return (
    <Container>
      <h2>My Insurance</h2>
      <MyTokens />
    </Container>
  )
}

function MyTokens(props) {
  const { active, account, library, networkId } = useWeb3Context()
  const signer = library.getSigner()
  const yinsureContract = new ethers.Contract(YINSURE_ADDRESS, YINSURE_ABI, signer)
  const quotationContract = new ethers.Contract(QUOTATION_ADDRESS, QUOTATION_ABI, signer)

  const [tokens, setTokens] = React.useState([])

  async function handleSubmitClaim(tokenId) {
    console.log(tokenId)
    yinsureContract.submitClaim(tokenId)
  }

  React.useEffect(() => {
    async function fetchData() {
      const address = await signer.getAddress()
      const balance = await yinsureContract.balanceOf(address)
      let tempTokens = []
      for (let i = 0; i < balance.toNumber(); i++) {
        const token = await yinsureContract.tokenOfOwnerByIndex(address, i)
        const tokenDetails = await yinsureContract.tokens(token.toNumber())
        const [_, coveredAddress] = await quotationContract.getscAddressOfCover(token.toNumber())
        var expirationDate = new Date(0)
        expirationDate.setUTCSeconds(tokenDetails.expirationTimestamp)
        tempTokens.push({
          id: token.toNumber(),
          coverId: tokenDetails.coverId.toNumber(),
          coverageAmount: tokenDetails.coverAmount.toNumber(),
          coverageCurrency: tokenDetails.coverCurrency === "0x45544800" ? "ETH" : "DAI",
          expiration: expirationDate.toString(),
          coveredAddress: coveredAddress
        })
      }
      setTokens(tempTokens)
    }
    fetchData()
  }, [])

  return (
    <div>
      {tokens.map(t => 
        <Card key={t.id}>
          <Card.Body>
            <Card.Title>Insurance Token {t.id}</Card.Title>
            <Card.Text>
              <ul>
                <li>Coverage: {t.coverageAmount} {t.coverageCurrency}</li>
                <li>Expiration: {t.expiration}</li>
                <li>Covered Contract: <a target="_blank" href={`https://etherscan.io/address/${t.coveredAddress}`}>{t.coveredAddress}</a></li>
              </ul>
            </Card.Text>
            <Button onClick={() => handleSubmitClaim(t.id)} variant="primary">Submit Claim</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
