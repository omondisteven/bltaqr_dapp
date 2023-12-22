//...src/generate/index.js
import React, { Fragment, useEffect } from "react";
import {useHistory} from "react-router-dom";
import "react-toggle/style.css";
// Import CSS files
import "./css/generator.css";
import "./css/index.css";
import "./css/style.css";
import "./css/styles.js";

export default function Generate() {
  const {go} = useHistory();
  useEffect(() => {
    const generatorDiv = document.querySelector(".generator");
    const generateBtn = generatorDiv.querySelector(".generator-form button");
    const qrInput = generatorDiv.querySelector(".generator-form input");
    const qrImg = generatorDiv.querySelector(".generator-img img");
    const downloadBtn = generatorDiv.querySelector(".generator-btn .btn-link");    

    let imgURL = '';

    generateBtn.addEventListener("click", () => {
      let qrValue = qrInput.value;
      if (!qrValue.trim()) // if value is empty then stop.
        return;

      generateBtn.innerText = "Generating QR Code....";

      // Perform the logic to generate the QR code (you can use a library or API)

      imgURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
      qrImg.src = imgURL;

      qrImg.addEventListener("load", () => {
        generatorDiv.classList.add("active");
        generateBtn.innerText = "Generate QR Code";
      });
    });

    // Download QR Code
    downloadBtn.addEventListener("click", () => {
      if (!imgURL)
        return;
      fetchImage(imgURL);
    });

    function fetchImage(url) {
      fetch(url)
        .then(res => res.blob())
        .then(file => {
          console.log(file);
          let tempFile = URL.createObjectURL(file);
          let file_name = url.split("/").pop().split(".")[0];
          let extension = file.type.split("/")[1];
          download(tempFile, file_name, extension);
        })
        .catch(() => imgURL = '');
    }

    function download(tempFile, file_name, extension) {
      let a = document.createElement('a');
      a.href = tempFile;
      a.download = `${file_name}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    qrInput.addEventListener("input", () => {
      if (!qrInput.value.trim())
        return generatorDiv.classList.remove("active");
    });
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <Fragment>
        <footer>
          <div class="container">
            <div class="generator">
                <h1>QR Code Generator</h1>
                <p>Paste a URL or Enter a text to create a QR code</p>
                <div class="generator-form">
                    <div class="options-row">
                        <div class="option">
                            <label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="logo" checked ></input>
                                    <span class="slider"></span>
                                </div>
                                &nbsp; <p style={{ fontSize: "6px", color: "black" }}>add logo</p>
                            </label>
                        </div>
                        <div class="option">
                            <label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="gradient" checked></input>
                                    <span class="slider"></span>
                                </div>
                                &nbsp; <p style={{ fontSize: "6px", color: "black" }}> add gradient</p>
                            </label>
                        </div>
                        <div class="option">
                            <label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="consensus"></input>
                                    <span class="slider"></span>
                                </div>
                                &nbsp; <p style={{ fontSize: "6px", color: "black" }}>wait for blockchain consensus</p>
                            </label>
                        </div>
                    </div>
                    <input type="text" placeholder="Enter a text or URL"></input>
                    <button>Generate QR Code</button>
                </div>

                <div class="generator-img">
                    <img src={require('./generator_images/qr-code.png')} alt="qr-code"></img>
                </div>

                <div class="generator-btn">
                    <button class="btn-link">Download <i class="fa-solid fa-download"></i></button>
                </div>
            </div>      
            <footer>
                <h4>Created by BLTA Solutions Ke</h4>
                <div class="icon2">
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        go(-1);
                      }}>
                          <p><i class="fa fa-qrcode" aria-hidden="true"></i> &nbsp;Scan Qr Code</p>
                    </a>
                    <a href="https://bltasolutions.co.ke/" target="_blank">
                        <p style={{ fontSize: "12px", color: "blue" }}><i class="fa fa-globe" aria-hidden="true"></i>&nbsp; Visit BLTA Solutions</p>
                    </a>
                </div>
            </footer>
          </div>
        </footer>
    </Fragment>    
  );
}
