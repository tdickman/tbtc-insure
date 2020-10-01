import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Initialize from '../pages/Initialize';
import Purchase from '../pages/Purchase';
import Marketplace from '../pages/Marketplace';
import { useWeb3Context } from "web3-react";
import { HashRouter } from 'react-router-dom';
import Header from '../components/Header';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { SUPPORTED_NETWORKS } from '../config'

export default function Routes() {
  const context = useWeb3Context();
  console.log(context)

  return (
    <div>
      <Header />
      <br/>
      {!context.active && (
      <Container>
        <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
              }}>
          <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '10px'}}>
            <Button variant="primary" onClick={() => context.setConnector('Metamask')}>
              Connect with Metamask
            </Button>
          </div>
          <p style={{textAlign: 'center'}}>Please make sure you have metamask installed and set to mainnet</p>
        </div>
      </Container>)}
      {context.active && SUPPORTED_NETWORKS.indexOf(context.networkId) === -1 &&
        <p>Make sure you are configured to use mainnet</p>
      }
      {context.active && <HashRouter>
        <Route path="/" exact component={Initialize} />
        <Route path="/purchase" exact component={Purchase} />
        <Route path="/marketplace" exact component={Marketplace} />
      </HashRouter>}
    </div>
  );
}
