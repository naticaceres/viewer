import * as React from "react";
import { Component } from "react";
import { any } from "prop-types";
const dxf = require("dxf/dist/dxf.js");

export interface ViewerProps {
  onFileParsed: (fileParsed: { svg: any; parsed: any }) => void;
}

export interface ViewerState {}

class FileManager extends React.Component<ViewerProps, ViewerState> {
  state = {
    file: any,
    dxfString: any
  };

  fileReader: any;

  handleFileRead = (e: any) => {
    const content = this.fileReader.result;
    this.state.dxfString = content;
    const helper = new dxf.Helper(content);
    const parsedFile = {
      svg: helper.toSVG(),
      parsed: helper.parsed
    };
    this.drawSvgText(parsedFile);
    this.props.onFileParsed(parsedFile);
  };

  handleTransform() {
    console.log("transform clicked");
    debugger;
  }

  handleFileUpload = (event: any) => {
    debugger;
    const file = event.currentTarget.files[0];
    console.log("file upload");
    console.log(file);
    this.setState({ file: file });

    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  };

  drawSvgText(parsedFile: any) {
    let id = 100;
    let textEntities = parsedFile.parsed.entities
      .filter((e: any) => e.type === "MTEXT")
      .map((e: any) => {
        id = id + 2;
        return (
          `<text writing-mode="lr-tb" text-anchor="start" x="` +
          e.x +
          `" y="` +
          e.y +
          `" font-size="` +
          e.nominalTextHeight +
          `" fill="currentColor" id="` +
          "ID_" +
          id +
          `" transform="matrix(1 0 0 -1 0 ` +
          e.y * 2 +
          `)">
     <tspan font-size="` +
          e.nominalTextHeight +
          `" baseline-shift="-100%">` +
          e.string +
          `</tspan>
    </text>
        `
        );
      })
      .join("");
    const textLayer =
      `<g id="draft" transform="matrix(1 0 0 -1 0 -6.66)" stroke-width="0.0042925">
      <g id="ID_0" color="rgb(0,0,0)" stroke="currentColor" fill="none" stroke-width="0.0042925">` +
      textEntities +
      `</g>
      </g>`;
    parsedFile.svg = parsedFile.svg.replace("</svg>", textLayer + " </svg>");
  }

  render() {
    //react.fragment does not show in the html template
    return (
      <div className="viewer">
        <button onClick={this.handleTransform}>transform</button>
        <input type="file" name="file" onChange={this.handleFileUpload} />
      </div>
    );
  }
}

export default FileManager;
