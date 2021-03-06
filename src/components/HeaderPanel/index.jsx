import React, { useState, useEffect } from 'react';
import Link from 'react-dom';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import coinAddressValidator from 'coin-address-validator';
import './styles.css';

const HeaderPanel = props => {
  useEffect(() => {
    // fetch('http://18.207.251.49:4006/status/ftm')
    fetch('https://api.faucet.fantom.network/status/ftm')
      .then(res => res.json())
      .then(result => {
        setAddress(result.address);
        setFtm(result.balance);
      });
  }, []);

  const [address, setAddress] = useState();
  const [ftm, setFtm] = useState();

  const [displayMsg, setDisplayMsg] = useState('');

  const [targetAddress, setTargetAddress] = useState('');

  const [tnxHash, setTnxHash] = useState('');
  const testnetExplorer = 'https://explorer.testnet.fantom.network/transactions/';

  const handleAddressChange = e => {
    setTargetAddress(e.target.value);
  };

  const validateAddress = () => {
    return coinAddressValidator.validate(targetAddress, 'eth', 'prod');
  };

  const handleGetFTM = () => {
    let isValidAddress = validateAddress();
    if (!isValidAddress) {
      setDisplayMsg('Invalid Opera Testnet Address!');
      setTnxHash('');
      return;
    }

    const toggleRequestButton = () => {
      let btn = document.getElementById('requestBtn');
      btn.disabled = !btn.disabled;
    };

    const sleep = ms => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    const sleepEffect = async () => {
      setDisplayMsg('');
      await sleep(100);
    };
    toggleRequestButton();
    // fetch('http://18.207.251.49:4006/request/ftm/' + targetAddress)
    fetch('https://api.faucet.fantom.network/request/ftm/' + targetAddress)
      .then(res => res.json())
      .then(async result => {
        if (result.hasOwnProperty('error')) {
          await sleepEffect();
          setDisplayMsg('Your account ' + result.input + ' has already ' + result.balance + 'test FTMs!');
          toggleRequestButton();
        } else if (result.hasOwnProperty('timeerror')) {
          await sleepEffect();
          setDisplayMsg(result.timeerror);
          setTnxHash('');
          toggleRequestButton();
        } else {
          await sleepEffect();
          setDisplayMsg(
            '10 Testnet FTMs successfully sent to ' + targetAddress + '! You can see the transaction here  ',
          );
          setTnxHash(result.transactionHash);
          setFtm(result.remainingBalance);
          toggleRequestButton();
        }
      });
  };
  return (
    <div className="headerContainer">
      <p>
        <font color="white" size="+5" className="fonts">
          Testnet Opera Faucet
        </font>
        <br></br>
        <font color="white" size="+2" className="fonts">
          Feel free to get test FTMs to your wallet
        </font>
      </p>
      <div className="faucetContainer">
        <FormControl className="ftmAddressInput" variant="filled">
          <FilledInput
            id="filled-adornment-weight"
            value={targetAddress}
            placeholder={'Input your testnet FTM Address'}
            onChange={handleAddressChange}
            endAdornment={<InputAdornment position="end"></InputAdornment>}
            aria-describedby="filled-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          <Button id="requestBtn" variant="contained" color="primary" className="button" onClick={handleGetFTM}>
            Request Testnet FTM
          </Button>
          <FormHelperText className="helper" id="filled-weight-helper-text">
            {displayMsg}
            <a href={testnetExplorer + tnxHash} target="_blank">
              {tnxHash}
            </a>
          </FormHelperText>
          <FormHelperText className="helper" id="filled-weight-helper-text">
            Testnet Opera FTMs are served from <b>{address}</b> with <b>{ftm}</b> Testnet FTMs.<br></br>You can request
            10 Testnet FTMs once per address every 5 minutes.
          </FormHelperText>
        </FormControl>
      </div>
    </div>
  );
};

export default HeaderPanel;
