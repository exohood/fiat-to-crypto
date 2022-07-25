import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

import CreditCardInput from "./renderers/creditCard";
import InputCryptoAddr from "../../common/Input/InputCryptoAddr";
import ButtonAction from "../../common/ButtonAction";
import InputButton from "../../common/Input/InputButton/InputButton";
import InfoBox from "../../common/InfoBox";
import HelpView from "../../common/HelpView";
import Help2FACreditCard from "./renderers/Help2FACreditCard";

import {
  APIContext,
  StepDataItems,
  DEFAULT_US_STATE,
  DEFAULT_CA_STATE,
  DEFAULT_COUNTRY,
  ItemType,
} from "../../ApiContext";
import type { CollectedStateType } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import icons from "rendered-country-flags";

import countryNames from "../../ApiContext/utils/contryNames";
import phoneCodes from "../../ApiContext/utils/phoneCodes";
import usStates from "../../ApiContext/utils/usStates";
import caStates from "../../ApiContext/utils/caStates";

import { scrollTo } from "../../utils";
import { GroupFieldsController } from "./utils";
import BuyCryptoView from "../../BuyCryptoView";
import ChooseGatewayView from "../../ChooseGatewayView/ChooseGatewayView";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import InputDelegator from "../../common/Input/InputDelegator";
import OverlayPicker from "../../common/OverlayPicker/OverlayPicker";
import { CountryIcon } from "@onramper/flag-icons";
import {
  GtmEvent,
  GtmEventAction,
  GtmEventCategory,
  GtmEventLabel,
} from "../../enums";
import { useGTMDispatch } from "../../hooks/gtm";
import { OnramperValidator } from "@onramper/validator/dist";
const CREDIT_CARD_FIELDS_NAME_GROUP = [
  "ccNumber",
  "ccMonth",
  "ccYear",
  "ccCVV",
];
const PHONE_NUMBER_FIELDS_NAME_GROUP = ["phoneCountryCode", "phoneNumber"];

type BodyFormViewType = {
  onActionButton: () => void;
  handleInputChange: (name: string, value: any) => void;
  fields: StepDataItems;
  isFilled?: boolean;
  isLoading?: boolean;
  errorObj?: { [key: string]: string | undefined };
  errorMsg?: string;
  infoMsg?: string;
  inputName?: string;
  onErrorDismissClick: (field?: string) => void;
  heading?: string;
  formName?: string;
};

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
  const validator = useRef(new OnramperValidator({}));
  const { collected, apiInterface } = useContext(APIContext);
  const { backScreen, nextScreen, onlyScreen } = useContext(NavContext);
  const {
    isFilled = false,
    isLoading = false,
    errorObj,
    errorMsg,
    infoMsg,
    formName,
    handleInputChange,
    onActionButton,
    fields = [],
  } = props;

  const [isRestartCalled, setIsRestartCalled] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const sendDataToGTM = useGTMDispatch();

  const restartToAnotherGateway = () => {
    apiInterface.clearErrors();
    setIsRestartCalled(true);
  };

  const gtmEventFormData = (
    action: GtmEventAction,
    category: GtmEventCategory,
    label: GtmEventLabel
  ) => {
    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action: action,
      category: category,
      label: label,
    };
    sendDataToGTM(gtmData);
  };

  const walletFieldClick = () => {
    gtmEventFormData(
      GtmEventAction.WALLET_FORM,
      GtmEventCategory.FIELD,
      GtmEventLabel.WALLET_ADDRESS
    );
  };

  const handleFormFieldClick = (field: BodyFormViewType["fields"][0]) => {
    if (getInputType(field) === "email") {
      gtmEventFormData(
        GtmEventAction.EMAIL_FORM,
        GtmEventCategory.FIELD,
        GtmEventLabel.EMAIL_ADDRESS
      );
    }
    if (getInputType(field) === "password") {
      gtmEventFormData(
        GtmEventAction.EMAIL_FORM,
        GtmEventCategory.FIELD,
        GtmEventLabel.PASSWORD
      );
    }
  };

  const handleSuccess = (fieldName: string) => {
    if (validator.current.fieldValid(fieldName) === true)
      return "Field validation is successful.";
    return "";
  };

  useEffect(() => {
    if (isRestartCalled && !collected.errors) {
      onlyScreen(<BuyCryptoView />);
      nextScreen(<ChooseGatewayView />);
      setIsRestartCalled(false);
    }
  }, [collected.errors, isRestartCalled, onlyScreen, nextScreen]);

  const formContainer = useRef<HTMLDivElement>(null);
  const generalErrorRef = useRef<HTMLDivElement>(null);
  const inputRefs = useMemo(() => {
    return [...fields, { name: "FATAL" }].map((field) => ({
      name: field.name,
      ref: React.createRef<HTMLDivElement>(),
    }));
  }, [fields]);

  useEffect(() => {
    fields.forEach((field, idx) => {
      if (inputRefs[idx]?.ref?.current?.getElementsByTagName("input")[0]?.value)
        validator.current.showMessageFor(field.name);
    });
  }, [fields, inputRefs]);

  const [countryHasChanged, setCountryHasChanged] = useState("initialkey");

  const [push2Bottom, setPush2Bottom] = useState(false);
  useEffect(() => {
    setPush2Bottom(fields.some((field) => field.name === "termsOfUse"));
  }, [fields]);

  const onChange = useCallback(
    (name: string, value: any, type?: string) => {
      let v = value;
      if (v && type === "date") {
        if (typeof value === "string") {
          v = {
            year: Number("0000" + value.split("-")[0].slice(-4)),
            month: Number("00" + value.split("-")[1].slice(-2)),
            day: Number("00" + value.split("-")[2].slice(-2)),
          };
        } else {
          v = {
            year: Number(v.year),
            month: Number(v.month),
            day: Number(v.day),
          };
        }
      }
      validator.current.showMessageFor(name);

      if (name === "cryptocurrencyAddressTag") {
        handleInputChange("cryptocurrencyAddress", {
          ...collected.cryptocurrencyAddress,
          memo: v,
        });
      }

      if (name === "verifyPhoneCode" || name === "verifyEmailCode")
        setVerifyCode(v);

      handleInputChange(name, v);

      if (name === "country") setCountryHasChanged(v);
    },
    [handleInputChange, collected.cryptocurrencyAddress]
  );

  useEffect(() => {
    // setting initial values
    if (countryHasChanged === "initialkey") {
      const country = collected.country ?? collected.selectedCountry;
      handleInputChange("country", country);
      if (country.toUpperCase() === "US")
        handleInputChange(
          "state",
          collected.state && collected.state !== "undefined"
            ? collected.state
            : DEFAULT_US_STATE
        );
      else if (country.toUpperCase() === "CA")
        handleInputChange(
          "state",
          collected.state && collected.state !== "undefined"
            ? collected.state
            : DEFAULT_CA_STATE
        );
      else handleInputChange("state", "undefined");

      setCountryHasChanged("undefinedkey");
    } else if (countryHasChanged.toUpperCase() === "US") {
      handleInputChange(
        "state",
        collected.state && collected.state !== "undefined"
          ? collected.state
          : DEFAULT_US_STATE
      );
      setCountryHasChanged("undefinedkey");
    } else if (countryHasChanged.toUpperCase() === "CA") {
      handleInputChange(
        "state",
        collected.state && collected.state !== "undefined"
          ? collected.state
          : DEFAULT_CA_STATE
      );
      setCountryHasChanged("undefinedkey");
    } else if (countryHasChanged !== "undefinedkey") {
      handleInputChange("state", "undefined");
      setCountryHasChanged("undefinedkey");
    }
  }, [
    countryHasChanged,
    collected.country,
    collected.state,
    collected.selectedCountry,
    handleInputChange,
  ]);

  // scroll to fields on new error (general error)
  useEffect(() => {
    if (errorMsg && generalErrorRef !== null) {
      if (generalErrorRef === null || generalErrorRef.current === null) return;
      scrollTo(formContainer.current, 0, 600);
    }
  }, [errorMsg]);

  // scroll to fields on new error (field error)
  useEffect(() => {
    if (errorObj && inputRefs !== null) {
      // smooth scroll to the first error
      let errName = Object.keys(errorObj)[0];

      // if the error is in any of the Credit/Debit Card fields, scoll to the first one (credit card number)
      if (CREDIT_CARD_FIELDS_NAME_GROUP.some((f) => f === errName))
        errName = CREDIT_CARD_FIELDS_NAME_GROUP[0];
      else if (PHONE_NUMBER_FIELDS_NAME_GROUP.some((f) => f === errName))
        errName = PHONE_NUMBER_FIELDS_NAME_GROUP[0];

      const errInput = inputRefs.find((inp) => inp.name === errName);
      if (!errInput || errInput.ref.current === null) return;
      const el = errInput.ref.current;
      scrollTo(
        formContainer.current,
        el.parentElement!.offsetTop -
          el.parentElement!.getBoundingClientRect().height -
          10,
        600
      );
    }
  }, [errorObj, inputRefs]);

  // Initialize group fields controller
  GroupFieldsController.initGroups();

  const groupedFieldDataPHONE = PHONE_NUMBER_FIELDS_NAME_GROUP.reduce(
    (acc, actual) => {
      const fieldItem = fields.find((field) => field.name === actual);
      if (fieldItem && fieldItem?.type !== "boolean")
        return {
          ...acc,
          [actual]: { ...fieldItem },
        };
      else return acc;
    },
    {} as { [key: string]: any }
  );

  const groupedFieldDataCC = CREDIT_CARD_FIELDS_NAME_GROUP.reduce(
    (acc, actual) => {
      const fieldItem = fields.find((field) => field.name === actual);
      if (fieldItem && fieldItem?.type !== "boolean")
        return {
          ...acc,
          [actual]: { ...fieldItem },
        };
      else return acc;
    },
    {} as { [key: string]: any }
  );

  return (
    <main ref={formContainer} className={stylesCommon.body}>
      <>
        <InfoBox
          in={!!infoMsg}
          type="info"
          className={`${stylesCommon["body-form-child"]}`}
        >
          {infoMsg}
        </InfoBox>
        <InfoBox
          ref={generalErrorRef}
          in={!!errorMsg}
          type="error"
          canBeDismissed
          onDismissClick={() => props.onErrorDismissClick()}
          className={`${stylesCommon["body-form-child"]}`}
        >
          {errorMsg}
        </InfoBox>
        <InfoBox
          ref={inputRefs[inputRefs.length - 1].ref}
          in={!!errorObj?.["FATAL"]}
          type="error"
          message={errorObj?.["FATAL"]}
          className={`${stylesCommon["body-form-child"]}`}
          actionText="Try another gateway"
          onActionClick={restartToAnotherGateway}
          onDismissClick={() => props.onErrorDismissClick("FATAL")}
          canBeDismissed
        >
          <span>{"Possible solutions:"}</span>
          <br />
          <span>· Use a differrent credit card.</span>
          <br />
          <span>
            · If you didn't use your real identity, start the process again
            providing it.
          </span>
          <br />
          <span>· Try another gateway.</span>
          <br />
          <span>· Contact us.</span>
        </InfoBox>

        {!!props.heading && <Heading text={props.heading} />}

        {fields.map((field, i) => {
          return (
            (field.name === "cryptocurrencyAddress" && (
              <InputCryptoAddr
                ref={inputRefs[i].ref}
                hint={field.hint}
                type={getInputType(field)}
                key={i}
                className={stylesCommon["body-form-child"]}
                handleInputChange={onChange}
                error={validator.current.message(
                  "cryptocurrencyAddress",
                  `${collected.selectedCrypto?.id}:${collected.cryptocurrencyAddress?.address}`
                )}
                success={handleSuccess("cryptocurrencyAddress")}
                disabled={!collected.isAddressEditable}
                onClick={walletFieldClick}
              />
            )) ||
            (field.name === "verifyCreditCard" && (
              <div className={stylesCommon["body-form-child"]} key={i}>
                <InputDelegator
                  value={collected[field.name] ?? ""}
                  isRequired={field.required !== false}
                  ref={inputRefs[i].ref}
                  onHintClick={() =>
                    nextScreen(
                      <HelpView buttonText={"Got it!"} dismissAfterClick>
                        <Help2FACreditCard />
                      </HelpView>
                    )
                  }
                  hint={"Where do I find this code?"}
                  name={field.name}
                  onChange={onChange}
                  label={field.humanName}
                  placeholder={field.placeholder}
                  error={
                    errorObj?.[field.name] ??
                    validator.current.message(field.name, collected[field.name])
                  }
                  success={handleSuccess(field.name)}
                  className={stylesCommon["body-form-child"]}
                  type={getInputType(field)}
                />
                <div
                  key={998}
                  onClick={() => backScreen()}
                  className={styles.resend}
                >
                  Resend code&nbsp;
                </div>
              </div>
            )) ||
            ((field.name === "verifyPhoneCode" ||
              field.name === "verifyEmailCode") && (
              <div className={stylesCommon["body-form-child"]} key={i}>
                <InputDelegator
                  isRequired={field.required !== false}
                  ref={inputRefs[i].ref}
                  hint={field.hint}
                  name={field.name}
                  onChange={onChange}
                  label={field.humanName}
                  placeholder={field.placeholder}
                  error={
                    errorObj?.[field.name] ??
                    validator.current.message(field.name, collected[field.name])
                  }
                  success={handleSuccess(field.name)}
                  className={stylesCommon["body-form-child"]}
                  type={getInputType(field)}
                  value={verifyCode}
                />
                <div
                  key={999}
                  onClick={() => backScreen()}
                  className={styles.resend}
                >
                  Resend code&nbsp;
                </div>
              </div>
            )) ||
            (field.type === "boolean" && field.name === "termsOfUse" && (
              <label
                key={i}
                className={`${stylesCommon["body-form-child"]} ${styles.terms}`}
              >
                <input
                  type="checkbox"
                  checked={collected[field.name] ?? false}
                  name={field.name}
                  onChange={(e) =>
                    onChange(
                      e.currentTarget.name,
                      e.currentTarget.checked,
                      e.currentTarget.type
                    )
                  }
                />
                &nbsp;I accept{" "}
                {field.terms
                  ?.map<React.ReactNode>((term, i) => (
                    <a
                      key={i}
                      href={term.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {term.humanName}
                    </a>
                  ))
                  .reduce((acc, actual, i, arr) => [
                    acc,
                    i === arr.length - 1 ? " and " : ", ",
                    actual,
                  ])}
                .
              </label>
            )) ||
            (field.type === "boolean" &&
              field.name === "areFundsFromLegalSources" && (
                <label
                  key={i}
                  className={`${stylesCommon.body__child} ${styles.terms}`}
                >
                  <input
                    type="checkbox"
                    checked={collected[field.name] ?? false}
                    name={field.name}
                    onChange={(e) =>
                      onChange(
                        e.currentTarget.name,
                        e.currentTarget.checked,
                        e.currentTarget.type
                      )
                    }
                  />
                  &nbsp;{field.humanName}
                </label>
              )) ||
            (field.type === "select" && (
              <InputButton
                ref={inputRefs[i].ref}
                key={i}
                className={stylesCommon["body-form-child"]}
                error={errorObj?.[field.name]}
                onClick={() =>
                  nextScreen(
                    <OverlayPicker
                      title={field.humanName}
                      name={field.name}
                      onItemClick={(name, index, item) => {
                        onChange(name, item.id);
                        backScreen();
                      }}
                      items={field.options.map((option) => ({
                        id: option.value,
                        name: option.humanName,
                        icon: option.icon,
                      }))}
                    />
                  )
                }
                label={field.humanName}
                selectedOption={
                  field.options.find((v) => v.value === collected[field.name])
                    ?.humanName ?? "Please select"
                }
              />
            )) ||
            (field.name === "country" && (
              <InputButton
                ref={inputRefs[i].ref}
                key={i}
                className={stylesCommon["body-form-child"]}
                error={errorObj?.[field.name]}
                onClick={() =>
                  nextScreen(
                    <OverlayPicker
                      title={field.humanName}
                      name={field.name}
                      onItemClick={(name, index, item) => {
                        onChange(name, item.id.toLowerCase());
                        backScreen();
                      }}
                      items={Object.entries(countryNames).map(
                        ([code, name]) => ({
                          id: code,
                          name,
                          iconSvg: <CountryIcon name={code} />,
                          info: code,
                        })
                      )}
                      searchable
                    />
                  )
                }
                label={field.humanName}
                selectedOption={
                  countryNames[
                    (collected[field.name] ?? DEFAULT_COUNTRY).toUpperCase()
                  ]
                }
                icon={
                  icons[
                    (collected[field.name] ?? DEFAULT_COUNTRY).toUpperCase()
                  ]
                }
              />
            )) ||
            (field.type === "choice" && (
              <InputButton
                ref={inputRefs[i].ref}
                key={i}
                className={stylesCommon["body-form-child"]}
                error={errorObj?.[field.name]}
                onClick={() =>
                  nextScreen(
                    <OverlayPicker
                      title={field.humanName}
                      name={field.name}
                      onItemClick={(name, index, item) => {
                        onChange(name, item.name);
                        backScreen();
                      }}
                      items={field.options.map((option) => ({
                        id: option,
                        name: option,
                      }))}
                      searchable
                    />
                  )
                }
                label={field.humanName}
                selectedOption={
                  collected[field.name] ?? `Select ${field.humanName}`
                }
              />
            )) ||
            (field.name === "state" &&
              (collected.country === "us" || collected.country === "ca" ? (
                <InputButton
                  ref={inputRefs[i].ref}
                  key={i}
                  className={stylesCommon["body-form-child"]}
                  onClick={() =>
                    nextScreen(
                      <OverlayPicker
                        title={field.humanName}
                        name={field.name}
                        onItemClick={(name, index, item) => {
                          onChange(name, item.id.toLowerCase());
                          backScreen();
                        }}
                        items={Object.entries(
                          collected.country === "us" ? usStates : caStates
                        ).map(([code, state]) => ({
                          id: code,
                          name: state,
                          info: code,
                        }))}
                        searchable
                      />
                    )
                  }
                  label={field.humanName}
                  selectedOption={
                    collected.country === "us"
                      ? usStates[
                          (collected.state && collected.state !== "undefined"
                            ? collected.state
                            : DEFAULT_US_STATE
                          ).toUpperCase()
                        ]
                      : caStates[
                          (collected.state && collected.state !== "undefined"
                            ? collected.state
                            : DEFAULT_CA_STATE
                          ).toUpperCase()
                        ]
                  }
                />
              ) : (
                <React.Fragment key={i}></React.Fragment>
              ))) ||
            (GroupFieldsController.isGroupRequired(
              field.name,
              CREDIT_CARD_FIELDS_NAME_GROUP,
              fields.map((f) => f.name)
            ) &&
              (!GroupFieldsController.isGroupAdded(
                CREDIT_CARD_FIELDS_NAME_GROUP
              ) ? (
                <div key={i} className={`${stylesCommon["body-form-child"]}`}>
                  <CreditCardInput
                    fieldsGroup={groupedFieldDataCC}
                    ref={inputRefs[i].ref}
                    ccNumberValue={collected.ccNumber}
                    ccMonthValue={collected.ccMonth}
                    ccYearValue={collected.ccYear}
                    ccCVVValue={collected.ccCVV}
                    key={i}
                    handleInputChange={onChange}
                    errorObj={
                      errorObj ?? {
                        ccNumber: validator.current.message(
                          "ccNumber",
                          collected.ccNumber
                        ),
                        ccMonth: validator.current.message(
                          "ccMonth",
                          collected.ccMonth
                        ),
                        ccYear: validator.current.message(
                          "ccYear",
                          collected.ccYear?.substr(-2)
                        ),
                        ccCVV: validator.current.message(
                          "ccCVV",
                          collected.ccCVV
                        ),
                      }
                    }
                    onSuccess={handleSuccess}
                  />
                </div>
              ) : (
                <React.Fragment key={i}></React.Fragment>
              ))) ||
            (GroupFieldsController.isGroupRequired(
              field.name,
              PHONE_NUMBER_FIELDS_NAME_GROUP,
              fields.map((f) => f.name)
            ) &&
              (!GroupFieldsController.isGroupAdded(
                PHONE_NUMBER_FIELDS_NAME_GROUP
              ) ? (
                <div
                  key={i}
                  className={`${stylesCommon["body-form-child"]} ${stylesCommon["row-fields"]}`}
                >
                  <InputButton
                    hint={groupedFieldDataPHONE["phoneCountryCode"]?.hint}
                    ref={
                      inputRefs[
                        fields.findIndex(
                          (field) => field.name === "phoneCountryCode"
                        )
                      ]?.ref
                    }
                    onClick={() =>
                      nextScreen(
                        <OverlayPicker
                          title={"Country code"}
                          name={"phoneCountryCode"}
                          onItemClick={(
                            name: string,
                            _: any,
                            item: ItemType
                          ) => {
                            onChange(name, +item.name);
                            onChange("country", item.id.toLowerCase());
                            backScreen();
                          }}
                          items={Object.entries(phoneCodes).map(
                            ([code, infoObj]) => ({
                              id: code,
                              name: infoObj.phoneCode,
                              info: infoObj.name,
                              searchWords: infoObj.searchWords,
                              iconSvg: <CountryIcon name={code} />,
                            })
                          )}
                          searchable
                        />
                      )
                    }
                    className={`${stylesCommon["row-fields__child"]} ${stylesCommon["shrink-0"]}`}
                    label="Country code"
                    selectedOption={
                      "+" + collected.phoneCountryCode ??
                      phoneCodes[(collected.country ?? "gb").toUpperCase()]
                        .phoneCode
                    }
                    error={errorObj?.phoneCountryCode}
                    renderIconSvg={(props) => (
                      <CountryIcon
                        {...props}
                        name={(collected.country || "GB").toUpperCase()}
                      />
                    )}
                  />
                  <InputDelegator
                    error={
                      errorObj?.phoneNumber ??
                      validator.current.message(
                        "phoneNumber",
                        collected["phoneNumber"]
                          ? `${collected["phoneCountryCode"]}${collected["phoneNumber"]}`
                          : ""
                      )
                    }
                    success={handleSuccess("phoneNumber")}
                    ref={
                      inputRefs[
                        fields.findIndex(
                          (field) => field.name === "phoneNumber"
                        )
                      ].ref
                    }
                    name="phoneNumber"
                    type="number"
                    value={collected.phoneNumber ?? ""}
                    onChange={onChange}
                    className={`${stylesCommon["row-fields__child"]}
                                            ${stylesCommon.grow}`}
                    placeholder={
                      groupedFieldDataPHONE["phoneNumber"]?.placeholder ||
                      "654 56 84 56"
                    }
                    hint={groupedFieldDataPHONE["phoneNumber"]?.hint}
                    label="Phone number"
                  />
                </div>
              ) : (
                <React.Fragment key={i}></React.Fragment>
              ))) ||
            (field.type !== "boolean" && (
              <InputDelegator
                isRequired={field.required !== false}
                ref={inputRefs[i].ref}
                key={i}
                hint={field.hint}
                error={
                  errorObj?.[field.name] ??
                  validator.current.message(field.name, collected[field.name])
                }
                success={handleSuccess(field.name)}
                name={field.name}
                value={getValueByField(field, collected)}
                onChange={onChange}
                className={stylesCommon["body-form-child"]}
                label={field.humanName}
                type={getInputType(field)}
                onClick={() => handleFormFieldClick(field)}
                placeholder={field.placeholder}
                disabled={
                  field.name === "cryptocurrencyAddressTag" &&
                  !collected.isAddressEditable
                }
                icon={field.icon}
                iconPosition={field.iconPosition}
              />
            ))
          );
        })}
        <div
          className={`${stylesCommon["body-form-child"]} ${
            push2Bottom ? "" : stylesCommon["grow-col"]
          }`}
        >
          <ButtonAction
            onClick={() => {
              onActionButton();
              if (formName === "walletForm") {
                gtmEventFormData(
                  GtmEventAction.WALLET_FORM,
                  GtmEventCategory.BUTTON,
                  GtmEventLabel.CONTINUE
                );
              }
              if (formName === "emailForm") {
                gtmEventFormData(
                  GtmEventAction.EMAIL_FORM,
                  GtmEventCategory.BUTTON,
                  GtmEventLabel.CONTINUE
                );
              }
            }}
            text={isLoading ? "Sending..." : "Continue"}
            disabled={!isFilled || isLoading || !validator.current.allValid()}
          />
          <Footer />
        </div>
      </>
    </main>
  );
};

const getValueByField = (
  field: BodyFormViewType["fields"][0],
  collected: CollectedStateType
) => {
  if (field.name === "cryptocurrencyAddressTag")
    return collected["cryptocurrencyAddress"]?.memo ?? "";
  else if (field.name) return collected[field.name];
  else return "";
};

const getInputType = (field: BodyFormViewType["fields"][0]) => {
  if (field.type === "integer") return "number";

  if (field.name === "email") return "email";

  if (field.name === "password") return "password";

  if (field.type === "string") return "text";

  if (field.type === "boolean") return "checkbox";

  return field.type;
};

BodyFormView.defaultProps = {};

export default BodyFormView;
