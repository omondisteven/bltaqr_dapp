import React, { Fragment, useState } from "react";
import { Scan } from "./scan";
import {Root, Footer, GlobalStyle, Result} from "./styles";
import {initializeAudio} from "./helper";
import {Button} from "./scan/styles";
import {useHistory} from 'react-router-dom';
import {useSelector} from "react-redux";

export default function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState();

  const beep = useSelector(state => state.prefs.beep);
  const crossHair = useSelector(state => state.prefs.crossHair);
  const bw = useSelector(state => state.prefs.bw);

  const onCapture = (code) => setResult(code);
  const onClear = () => setIsCameraOpen(false);
  const {push} = useHistory();

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
        <div style={{paddingTop: 180}}>
          <h3>Welcome to Cameroon!</h3>
          <p>Click SCAN to start the QR code scanner :)</p>
        </div>
      );
  };

  const renderCamera = () => {
    if (isCameraOpen) return (
      <Scan onCapture={onCapture} onClear={onClear} beepOn={beep} bw={bw} crosshair={crossHair}/>
    );
  };

  const renderResult = () => {
    if (result) return (
      <Result>
        <p>{result['rawcode']}</p>
        <p><b>{result['milliseconds']} ms</b></p>
      </Result>
    );
  };

  const renderSettingsButton = () => {
    if (!isCameraOpen || result) return (
        <Button style={{backgroundColor: "green"}} onClick={async () => push("/settings")}>PREFS</Button>
    );
  };

  return (
    <Fragment>
      <Root>
        <div style={{minHeight: 430, margin: 20}}>
          {renderHelp()}
          {renderResult()}
          {renderCamera()}
        </div>

        <Footer>
          <div>
            {!isCameraOpen ?
              <Button onClick={handleStartScanBtn}>SCAN</Button> :
              <Button onClick={handleStopScanBtn} style={{backgroundColor: "red"}}>STOP</Button>
            }
          </div>
          <div style={{flexBasis: "100%", height: 0}}></div>
          {renderSettingsButton()}
        </Footer>
      </Root>
      <GlobalStyle/>
    </Fragment>
  );
}
