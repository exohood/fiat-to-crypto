import { OverviewStepItem } from "../../../common/StepsOverview/StepsOverview.models";

type StepFormBaseField = {
  placeholder?: string;
  icon?: string;
  iconPosition?: "start" | "end";
};

type StepDataItems = Array<
  StepFormBaseField &
    (
      | {
          type: "select";
          name: string;
          humanName: string;
          options: {
            value: string;
            humanName: string;
            icon?: string;
          }[];
          hint?: string;
          required?: boolean;
        }
      | {
          type: "choice";
          options: string[];
          humanName: string;
          name: string;
          hint?: string;
          required?: boolean;
        }
      | {
          type: "string" | "integer";
          humanName: string;
          name: string;
          hint?: string;
          required?: boolean;
        }
      | {
          type: "date";
          name: string;
          humanName: string;
          hint?: string;
          required?: boolean;
          data: [
            {
              type: "integer";
              humanName: "Day";
              name: "day";
            },
            {
              type: "integer";
              humanName: "Month";
              name: "month";
            },
            {
              type: "integer";
              humanName: "Year";
              name: "year";
            }
          ];
        }
      | {
          type: "boolean";
          name: "areFundsFromLegalSources";
          humanName: string;
          required: boolean;
        }
      | {
          type: "boolean";
          name: "termsOfUse";
          terms: {
            url: string;
            humanName: string;
          }[];
        }
    )
>;

export enum StepType {
  iframe = "iframe",
  information = "information",
  form = "form",
  redirect = "redirect",
  popup = "popup",
  actionableError = "actionable-error",
  wait = "wait",
  pickOne = "pickOne",
  completed = "completed",
  requestBankTransaction = "requestBankTransaction",
  instruction = "instruction",
  file = "file",
  emailVerification = "emailVerification",
  orderComplete = "orderComplete",
  paymentReview = "paymentReview",
  stepsOverview = "stepsOverview",
}

interface FileStep {
  type: StepType.file;
  humanName: string;
  hint?: string;
  url: string;
  acceptedContentTypes: string[];
}

interface PickOneOption {
  title: string;
  description?: string;
  icon?: string;
  nextStep: NextStep;
}
export interface TextType {
  type: string;
  text: string;
  align?: "left" | "right" | "center" | "justify";
}

export interface ImageType {
  type: string;
  items: { image: string; text?: string }[];
}
interface InfoDepositBankAccount {
  iban: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  accountName: string;
  accountAddress: string;
}

type EmailVerificationStep = {
  type: StepType.emailVerification;
  url?: string;
  description?: string;
  data: {
    humanName: string;
    name: string;
    hint?: string;
    initialValue?: string;
    placeholder: string;
  };
};

type OrderCompleteStep = {
  type: StepType.orderComplete;
  description?: string;
};

type NextStepBase = {
  useHeading?: boolean;
  title?: string;
  progress?: number;
  humanName?: string;
  description?: string;
  eventName?: string;
  eventCategory?: string;
  eventLabel?: string;
  url?: string;
  txId?: string;
};

export type PayamentReviewDataItem = {
  type: StepType.stepsOverview;
  items: OverviewStepItem[];
};

export type PaymentReviewStep = {
  type: StepType.paymentReview;
  url?: string;
  data: PayamentReviewDataItem[];
};

type NextStep = NextStepBase &
  (
    | FileStep
    | {
        type: StepType.information;
        url?: string;
        message: string;
        extraData?: StepDataItems;
      }
    | {
        type: StepType.form;
        url: string;
        data: StepDataItems;
        hint?: string;
      }
    | {
        type: StepType.iframe;
        url: string;
        fullscreen: boolean;
        neededFeatures?: string;
      }
    | {
        type: StepType.redirect;
        url: string;
        hint?: string;
      }
    | {
        type: StepType.popup;
        url: string;
        restartUrl: string;
        humanName: string;
        hint?: string;
        nextStep: NextStep;
        failStep: NextStep;
        neededFeatures?: string;
        fullscreen: boolean;
      }
    | {
        type: StepType.actionableError;
        nextStep?: NextStep;
        humanName: string;
        title: string;
        message: string;
        fatal?: boolean;
        optionalUrl?: string;
      }
    | {
        type: StepType.wait;
        url: string;
        extraData?: StepDataItems;
        title?: string;
        message?: string;
      }
    | {
        type: StepType.pickOne;
        buttonActionTitle?: string;
        options: PickOneOption[];
      }
    | {
        type: StepType.completed;
        trackingUrl: string;
      }
    | {
        type: StepType.requestBankTransaction;
        depositBankAccount: InfoDepositBankAccount;
        reference: string;
        hint: string;
      }
    | {
        type: StepType.instruction;
        sections: Array<TextType | ImageType>;
        buttonActionTitle: string;
        url?: string;
      }
    | EmailVerificationStep
    | OrderCompleteStep
    | PaymentReviewStep
  );

export const isStepData = (_obj: unknown) => {
  const obj = _obj as NextStep;
  if (!obj.type) {
    return false;
  }
  return Object.entries(StepType).some(([, value]) => value === obj.type);
};

interface FieldError {
  field: string;
  message: string;
}

type NextStepErr = FieldError[] | { message: string };

export type {
  NextStep,
  StepDataItems,
  InfoDepositBankAccount,
  FileStep,
  NextStepErr,
  FieldError,
  PickOneOption,
};
