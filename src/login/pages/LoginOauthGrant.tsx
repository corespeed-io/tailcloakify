import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";
import { primaryButtonClass, secondaryButtonClass } from "../buttonClasses";
import { Check, Server } from "lucide-react";
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
    const { url, oauth, client, mcpServers = {} } = kcContext;

    const { advancedMsgStr, msgStr } = i18n;

    const clientName = client.name ? advancedMsgStr(client.name) : client.clientId;
    const mcpServerList = Object.values(mcpServers);
    const hasMcpMetadata = mcpServerList.length > 0;

    // Extract URLs from client attributes
    const termsUrl = client.attributes.tosUri || null;
    const privacyUrl = client.attributes.policyUri || null;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={true}
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
                        {/* Regular OAuth scopes */}
                        {oauth.clientScopesRequested.map((scope, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>{advancedMsgStr(scope.consentScreenText)}</span>
                            </div>
                        ))}

                        {/* MCP Servers (injected from LoginFormProvider) */}
                        {mcpServerList.map((server, index) => (
                            <div key={`mcp-${index}`} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Server className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">
                                        {server.name}
                                    </span>
                                </div>
                                {server.pricing != null && (
                                    <span className="text-sm font-medium text-gray-600">
                                        ${server.pricing.toFixed(2)} / request
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>


                {/* Info text */}
                <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                    <p>
                        {hasMcpMetadata
                            ? msgStr("oauthGrantInfoText1", clientName)
                            : msgStr("oauthGrantInfoText1NoBilling", clientName)
                        }
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
