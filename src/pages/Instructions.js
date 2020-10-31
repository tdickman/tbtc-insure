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

export default function Instructions(props) {
  return (
    <Container>
      <h2>Instructions</h2>
      <p>tbtc.insure provides a way to purchase Nexus Mutual insurance via the yinsure.finance smart contract (<a target="_blank" href="https://etherscan.io/address/0x181Aea6936B407514ebFC0754A37704eB8d98F91">0x181Aea6936B407514ebFC0754A37704eB8d98F91</a>). Purchased insurance is provided via an ERC721 token, which allows users to transfer ownership, and purchase without providing any kyc (a requirement for purchasing directly from Nexus Mutual). In the future this site will provide the ability to freely transfer ownership of tokens.</p>
      <p>NOTE: tbtc.insure provides an interface to purchase Nexus Mutual insurance from yinsure.finance, and makes no claims as to what this insurance covers. Please visit <a target="_blank" href="https://yinsure.finance">yinsure.finance</a> and <a target="_blank" href="https://nexusmutual.io/">Nexus Mutual</a> for more details. Don't trust, verify.</p>
    </Container>
  )
}
