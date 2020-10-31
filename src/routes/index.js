import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Initialize from '../pages/Initialize';
import Dashboard from '../pages/Dashboard';
import Purchase from '../pages/Purchase';
import Marketplace from '../pages/Marketplace';
import Instructions from '../pages/Instructions';
import { useWeb3Context } from "web3-react";
import { HashRouter } from 'react-router-dom';
import Header from '../components/Header';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { SUPPORTED_NETWORKS } from '../config'

export default function Routes() {
  const context = useWeb3Context();

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
          <p style={{textAlign: 'center'}}>By clicking connect you agree to the terms listed under the instructions tab. Please make sure you have metamask installed and set to mainnet.</p>
        </div>
      </Container>)}
      {context.active && SUPPORTED_NETWORKS.indexOf(context.networkId) === -1 &&
        <p>Make sure you are configured to use mainnet</p>
      }
      {context.active && <HashRouter>
        <Route path="/" exact component={Initialize} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/purchase" exact component={Purchase} />
        <Route path="/marketplace" exact component={Marketplace} />
        <Route path="/instructions" exact component={Instructions} />
      </HashRouter>}
    </div>
  );
}
