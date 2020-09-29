import React, { useState } from 'react';
import { ethers } from 'ethers'
import connectors from "../Connectors.js";
import { Link } from 'react-router-dom';
import { useWeb3Context } from "web3-react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Purchase(props) {
  const { active, account, library, networkId } = useWeb3Context();
  const signer = library.getSigner();
  // const serviceContract = new ethers.Contract(RandomBeaconService.networks[networkId].address, RandomBeaconImpl.abi, signer);
  
  return (
    <Container>
      <h2>Purchase</h2>
    </Container>
  )
}
