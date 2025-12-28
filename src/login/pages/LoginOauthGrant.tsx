import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";
import { primaryButtonClass, secondaryButtonClass } from "../buttonClasses";
import { ChevronDown } from "lucide-react";
import corespeedIcon from "../assets/logo/corespeed-icon.svg";

export default function LoginOauthGrant(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-oauth-grant.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
    const { url, oauth, client } = kcContext;

    const { advancedMsgStr, msgStr } = i18n;

    const clientName = client.name ? advancedMsgStr(client.name) : client.clientId;

    // Configure these URLs for your platform (set to null to hide)
    const pricingUrl: string | null = null; // "https://corespeed.io/pricing"
    const termsUrl: string | null = client.attributes.tosUri || null;
    const privacyUrl: string | null = client.attributes.policyUri || null;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={false}
        >
            <div className="space-y-6">
                {/* Title section */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-normal text-gray-900">
                        {msgStr("oauthGrantTitle")}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {msgStr("oauthGrantSubtitle")}
                    </p>
                </div>

                {/* App icon/logo and name */}
                <div className="flex items-center gap-3 py-2">
                    <img
                        src={client.attributes.logoUri || corespeedIcon}
                        alt={clientName}
                        className="w-10 h-10 object-contain"
                    />
                    <p className="font-medium text-gray-900">{clientName}</p>
                </div>

                {/* Permission section */}
                <div className="space-y-3">
                    <p className="text-sm text-gray-900">
                        {msgStr("oauthGrantAppWouldLikeTo")}
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                            <span>{msgStr("oauthGrantPermSignIn")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                            <span>{msgStr("oauthGrantPermMcp")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                            <span>{msgStr("oauthGrantPermBilling")}</span>
                        </div>
                    </div>
                </div>

                {/* MCP and Pricing info */}
                {(client.attributes.mcpServer || client.attributes.mcpPricing) && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {client.attributes.mcpServer && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{msgStr("oauthGrantMcpServer")}</span>
                                <span className="font-medium text-gray-900">{client.attributes.mcpServer}</span>
                            </div>
                        )}
                        {client.attributes.mcpPricing && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{msgStr("oauthGrantPricing")}</span>
                                <span className="font-medium text-gray-900">{client.attributes.mcpPricing}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Info text */}
                <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                    <p>
                        {msgStr("oauthGrantInfoText1", clientName)}
                    </p>
                    <p>
                        {msgStr("oauthGrantInfoText2")}
                        {(termsUrl || privacyUrl) && (
                            <>
                                {" "}{msgStr("oauthGrantSee")}{" "}
                                {termsUrl && (
                                    <a href={termsUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                        {msgStr("oauthGrantTermsOfService")}
                                    </a>
                                )}
                                {termsUrl && privacyUrl && ` ${msgStr("oauthGrantAnd")} `}
                                {privacyUrl && (
                                    <a href={privacyUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                        {msgStr("oauthGrantPrivacyPolicy")}
                                    </a>
                                )}
                                .
                            </>
                        )}
                        {" "}{msgStr("oauthGrantRevokeAnytime")}
                        {pricingUrl && (
                            <>
                                {" "}
                                <a href={pricingUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                    {msgStr("oauthGrantViewPricing")}
                                </a>
                            </>
                        )}
                    </p>
                </div>

                {/* Action buttons */}
                <form action={url.oauthAction} method="POST" className="pt-4">
                    <input type="hidden" name="code" value={oauth.code} />

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            name="cancel"
                            className={clsx(
                                secondaryButtonClass,
                                "flex-1"
                            )}
                        >
                            {msgStr("doCancel")}
                        </button>
                        <button
                            type="submit"
                            name="accept"
                            className={clsx(
                                primaryButtonClass,
                                "flex-1"
                            )}
                        >
                            {msgStr("doAccept")}
                        </button>
                    </div>
                </form>
            </div>
        </Template>
    );
}
