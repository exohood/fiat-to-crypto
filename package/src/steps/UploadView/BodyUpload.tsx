import React, { useState, useEffect } from "react";
import stylesCommon from "../../styles.module.css";

import InfoBox from "../../common/InfoBox";
import ButtonAction from "../../common/ButtonAction";
import UploadBox from "./UploadBox";
import { isFileUploaded } from "../utils";
import Footer from "../../common/Footer";

type BodyUploadType = {
  onActionButton: (file: File) => void;
  textInfo?: string;
  isLoading?: boolean;
  errorMsg?: string;
  acceptedContentTypes?: string[];
};

const BodyUpload: React.FC<BodyUploadType> = (props) => {
  const { textInfo, isLoading = false, errorMsg } = props;
  const { onActionButton } = props;
  const [existingFiles, setExistingFiles] = useState<File[]>([]);

  const [errorControlMsg, setErrorControlMsg] = useState<string>();

  useEffect(() => {
    setErrorControlMsg(errorMsg);
  }, [errorMsg]);

  const handleFilesAdd = (name: string, files: File[], maxFiles: number) => {
    setErrorControlMsg(undefined);
    if (
      !files.every((file) =>
        props.acceptedContentTypes?.some((t) => file.type === t)
      )
    ) {
      const errorsMessage = `Type not valid. Please upload a ${props.acceptedContentTypes?.reduce(
        (acc, actual, index) => {
          if (index === 0) return actual;
          return `${acc}, ${actual}`;
        },
        ""
      )} file.`;
      setErrorControlMsg(errorsMessage);
      return false;
    }

    const existingFilesNames = existingFiles.map((f) => f.name);
    files = files.filter((f) => !existingFilesNames.includes(f.name));
    if (existingFilesNames.length + files.length > maxFiles) {
      setErrorControlMsg(`Upload only ${maxFiles} files.`);
      return false;
    }
    setExistingFiles((prev) => [...prev, ...files]);
    return true;
  };

  const handleFilesDelete = (name: string, fileName: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.name !== fileName));
    return true;
  };

  const smallHeightScreen =
    window.screen.height <= 615 || window.screen.width <= 575;

  return (
    <main className={stylesCommon.body}>
      <InfoBox in={!!textInfo} className={`${stylesCommon.body__child}`}>
        {textInfo}
      </InfoBox>
      <InfoBox
        type="error"
        in={!!errorControlMsg}
        className={`${stylesCommon.body__child}`}
        canBeDismissed
        onDismissClick={() => setErrorControlMsg(undefined)}
      >
        {errorControlMsg}
      </InfoBox>
      <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
        <UploadBox
          id="files"
          onFilesAdded={handleFilesAdd}
          onFileDeleted={handleFilesDelete}
          filesList={existingFiles}
          maxFiles={1}
          acceptedContentTypes={props.acceptedContentTypes}
        >
          <strong>
            {smallHeightScreen ? "Click here to" : "Drag and Drop"}
          </strong>
          <br />
          {smallHeightScreen
            ? "upload a file or take a picture"
            : "a file or click here"}
          <br />[{" "}
          {props.acceptedContentTypes
            ?.map((type) => type.split("/")[1])
            ?.reduce((acc, actual, index) => {
              if (index === 0) return actual;
              return `${acc} or ${actual}`;
            }, "")}{" "}
          ]
        </UploadBox>
      </div>
      <div className={`${stylesCommon.body__child}`}>
        <ButtonAction
          onClick={() => onActionButton(existingFiles[0])}
          text={isLoading ? "Verifying..." : "Continue"}
          disabled={!isFileUploaded(existingFiles) || isLoading}
        />
        <Footer />
      </div>
    </main>
  );
};

BodyUpload.defaultProps = {
  onActionButton: () => null,
};

export default BodyUpload;
