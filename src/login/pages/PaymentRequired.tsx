import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { primaryButtonClass, secondaryButtonClass } from "../buttonClasses";
import { CreditCard } from "lucide-react";

export default function PaymentRequired(
    props: PageProps<Extract<KcContext, { pageId: "payment-required.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, checkoutUrl, username } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                <div className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Payment Required</span>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-gray-600">
                        Hi <span className="font-semibold text-black">{username}</span>,
                    </p>
                    <p className="text-gray-600">
                        To continue, please add a payment method to your account.
                    </p>
                </div>

                <div className="pt-4">
                    <a
                        href={checkoutUrl}
                        className={clsx(
                            primaryButtonClass,
                            "w-full flex items-center justify-center gap-2 no-underline hover:no-underline"
                        )}
                    >
                        <CreditCard className="h-4 w-4" />
                        Add Payment Method
                    </a>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        You will be redirected back after adding your payment method.
                    </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                    <a
                        href={url.loginRestartFlowUrl}
                        className={clsx(
                            secondaryButtonClass,
                            "w-full flex items-center justify-center no-underline hover:no-underline mt-4"
                        )}
                    >
                        Restart Login
                    </a>
                </div>
            </div>
        </Template>
    );
}
