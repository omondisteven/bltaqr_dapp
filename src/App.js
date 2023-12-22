//App.jsx
import React, { Fragment, useState, } from "react";
import { Scan } from "./scan";
import { Root, Footer, GlobalStyle, Result } from "./css/styles";
import { initializeAudio } from "./helper";
import { Button } from "./scan/styles";
import { useHistory, Link } from 'react-router-dom';  // Import Link from 'react-router-dom'
import { useSelector } from "react-redux";
import { useQueryState } from "./hooks/useQueryState";
import { encryptMessage, encodeEncryptedMessageAsBase64 } from "@maslick/kameroon";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();
  const [redirect_url] = useQueryState("redirect_url");
  const [publicKey] = useQueryState("public_key");

  const beep = useSelector(state => state.prefs.beep);
  const crossHair = useSelector(state => state.prefs.crossHair);
  const crossHairStyle = useSelector(state => state.prefs.crossHairStyle);
  const bw = useSelector(state => state.prefs.bw);

  const onCapture = async (code) => {
    if (redirect_url && publicKey) {
      const encryptedMessage = await encryptMessage(decodeURIComponent(publicKey), code.rawcode);
      const encryptedMessageBase64 = encodeEncryptedMessageAsBase64(encryptedMessage);
      const base64urlEncodedMessage = encodeURIComponent(encryptedMessageBase64);
      setTimeout(() => {
        window.location.replace(`${redirect_url}?code=${base64urlEncodedMessage}`);
      }, 300);
    } else
      setResult(code);
  };

  const onClear = () => setIsCameraOpen(false);
  const { push } = useHistory();

  const handleStartScanBtn = () => {
    initializeAudio();
    setIsCameraOpen(true);
    setResult(undefined);
  };

  const handleStopScanBtn = () => {
    setIsCameraOpen(false);
    setResult(undefined);
  };

  const renderHelp = () => {
    if (!isCameraOpen && !result)
      return (
        <div style={{ paddingTop: 10 }}>
          <h3>Welcome to...</h3>
          <img src={require('./assets/bltaqr_black_logo.png')} alt="BLTA Logo" style={{ width: '200px', marginBottom: '20px', marginTop: '20PX' }} />
          
          <h3><a href="https://bltasolutions.co.ke">BLTA QR CODES SCANNER DAPP</a>!</h3>
          <br></br>
          <br></br>
          <p>Goood News!! Your QR Codes are now end-to-end encrypted</p>         
        </div>
      );
  };

  const renderCamera = () => {
    if (isCameraOpen) return (
      <Scan
        onCapture={onCapture}
        onClear={onClear}
        beepOn={beep}
        bw={bw}
        scanRate={200}
        crosshair={{ enabled: crossHair, style: crossHairStyle }}
      />
    );
  };

  const renderResult = () => {
    if (result) return (
      <Result>
        <p>{result['rawcode']}</p>
        <div><b>{result['alg']}:</b> {result['milliseconds']} ms</div>
        <div><b>type</b>: {result["type"]}</div>
      </Result>
    );
  };

  const renderSettingsButton = () => {
    if (!isCameraOpen || result) return (
      <Button style={{ backgroundColor: "green" }} onClick={async () => push("/config")}>Settings</Button>
    );
  };

  const renderGenerateQrButton = () => {
    if (!isCameraOpen || result) return (
      <Button style={{ backgroundColor: "black" }} onClick={async () => push("/generate")}>Generate Qr Code</Button>
    );
  };

  return (
    <div className="container">
      {/* <Router> */}
        <Fragment>
          <Root>
            <div style={{ minHeight: 430, margin: 20 }}>
              {renderHelp()}
              {renderResult()}
              {renderCamera()}
            </div>

            <Footer>
              <div>
                {!isCameraOpen && (
                  <>
                    <Button onClick={handleStartScanBtn}>Scan Qr Code</Button>
                  </>
                )}
                {isCameraOpen && (
                  <Button onClick={handleStopScanBtn} style={{ backgroundColor: "red", width: '100%' }}>Cancel</Button>
                )}
              </div>
              <div style={{ flexBasis: "100%", height: 0 }}></div>
              {renderGenerateQrButton()}
              {renderSettingsButton()}              
            </Footer>
          </Root>
          <GlobalStyle />
        </Fragment>
        { /* <Route path="/generate" component={Generate} /> */ }
      {/* </Router> */}
    </div>
  );
}