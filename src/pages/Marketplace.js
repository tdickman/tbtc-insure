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
import fetch from 'node-fetch';

export default function MarketPlace(props) {
  return (
    <Container>
      <h2>Marketplace</h2>
      <p>Buy and resell tbtc insurance (as ERC721 tokens). Coming soon.</p>
    </Container>
  )
}
