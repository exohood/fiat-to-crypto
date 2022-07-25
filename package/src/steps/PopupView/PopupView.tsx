import React, { useEffect, useState, useCallback, useContext } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InfoBox from '../../common/InfoBox'

import { SANDBOX_HOSTNAME, MOONPAY_HOSTNAME, COINIFY_HOSTNAME } from '../../ApiContext/api/constants'
import { APIContext, NextStep } from '../../ApiContext'
import { NavContext } from '../../NavContext'

import BuyCryptoView from '../../BuyCryptoView'
import ButtonAction from '../../common/ButtonAction'
import Step from '../Step'
import { StepType } from '../../ApiContext/api/types/nextStep'

interface PopupLauncherViewType {
    src: string
    type: string
    textInfo?: string
    error?: string
    fatalError?: string
    features?: string
    uploadFailed?: boolean
    processFinished?: boolean
    failStep: NextStep
    nextStep?: NextStep
    onErrorDismissClick: (type?: string) => void
}

const getHostname = (href: string) => {
    const location = document.createElement("a");
    location.href = href;
    // IE doesn't Fpopulate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === "") {
        location.href = location.href; // eslint-disable-line no-self-assign
    }
    return location.hostname;
};

const PopupLauncherView: React.FC<PopupLauncherViewType> = (props) => {
    const { type } = props
    const [iframeUrl, setIframeUrl] = useState(props.src)

    const { collected } = useContext(APIContext)
    const { selectedGateway } = collected
    const [isRestartCalled, setIsRestartCalled] = useState(false)

    const { onlyScreen, nextScreen, replaceScreen } = useContext(NavContext)


    useEffect(() => {
        if (isRestartCalled && !collected.errors) {
            onlyScreen(<BuyCryptoView />)
            setIsRestartCalled(false)
        }
    }, [collected.errors, isRestartCalled, onlyScreen, nextScreen, props.fatalError])

    const redirect = useCallback(async (url: string) => {

        //try to open popup
        const windowObjectReference = window.open(url, '_blank', 'height=595,width=440,scrollbars=yes,left=0')//todo: add config
        //if opened -> all is ok
        if (windowObjectReference) {
            const interval = 250
            const times2Count = 1000 * 60 / interval
            let count = 0
            const checkIfClosed = setInterval(() => {
                if (windowObjectReference.closed || count > times2Count) {
                    clearInterval(checkIfClosed)
                }
                count++
            }, interval)
        }
    }, [])

    useEffect(() => {
        let urlTail = ''
        const hostname = getHostname(props.src).split('.').splice(1).join('.')
        const primaryColor = collected.themeColor
        if (primaryColor)
            if (hostname === SANDBOX_HOSTNAME) {
                urlTail = `${props.src.includes('?') ? '&' : '?'}color=${primaryColor}`
            }
            else if (hostname === MOONPAY_HOSTNAME) {
                urlTail = `${props.src.includes('?') ? '&' : '?'}colorCode=%23${primaryColor}`
            }
            else if (hostname === COINIFY_HOSTNAME) {
                urlTail = `${props.src.includes('?') ? '&' : '?'}primaryColor=${primaryColor}`
            }

        const newIframeUrl = `${props.src}${urlTail}`
        setIframeUrl(newIframeUrl)
    }, [props.src, redirect, type, selectedGateway, collected.themeColor])

    return (
        <main className={`${stylesCommon.body} ${styles.body}`}>
            {
                <>
                <InfoBox in={!!props.processFinished && !!props.uploadFailed} className={`${stylesCommon.body__child} ${styles.body__child}`} type="error">
                    Your documents failed to upload. Please try again.
                </InfoBox>
                <InfoBox in={true} className={`${stylesCommon.body__child} ${styles.body__child}`}>
                    Please make sure there is enough light for your documents and face to be clearly visible. Printed photocopies are not accepted.
                </InfoBox>
                </>
            }
            <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
                {
                    (props.fatalError && (
                        <div className={`${styles.center}`}>
                            <span>{props.fatalError}</span>
                        </div>
                    ))
                    || ((type === StepType.popup) && (
                        <div className={`${styles.center}`} >
                            <span style={{ width: '75%', marginBottom: "2rem" }} className={`${stylesCommon.body__child} `}>Coinify is legally required to have proof of your identity. After clicking the button bellow, please follow the instructions to upload and verify your documents. </span>

                            <span style={{ width: '50%' }}>
                                <ButtonAction  text="Begin" size='small'
                                onClick={
                                    (!props.processFinished && !props.uploadFailed) ?
                                        () => {
                                            console.log("tried to do redirect at: ", iframeUrl)
                                            redirect(iframeUrl)
                                        }
                                        :() => {
                                            console.log("tried to do fail step", props.processFinished, props.uploadFailed)
                                            replaceScreen(
                                              <Step
                                                gtmToBeRegisterStep={
                                                  props.nextStep
                                                }
                                                nextStep={props.failStep}
                                              />
                                            );
                                        }
                                    } />
                            </span>
                        </div>
                    ))
                    || <iframe
                        title='Sandbox'
                        src={iframeUrl}
                        allow={props.features}
                        style={{
                            width: '100%',
                            minHeight: '100%',
                            borderStyle: 'none'
                        }}
                    />
                }
            </div>
        </main >
    )
}

export default PopupLauncherView
