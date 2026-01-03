import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext, McpServerInfo } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";
import { primaryButtonClass, secondaryButtonClass } from "../buttonClasses";
import { Check, Server, Loader2 } from "lucide-react";
import corespeedIcon from "../assets/logo/corespeed-icon.svg";
import { useState, useEffect, useMemo } from "react";

// Scope format: mcp:servers:{server_slug}
const MCP_SCOPE_PREFIX = "mcp:servers:";

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
    const { url, oauth, client, mcpServers: initialMcpServers = {} } = kcContext;

    const { advancedMsgStr, msgStr } = i18n;

    // State for MCP servers - use kcContext data if available (Storybook), otherwise fetch
    const [mcpServers, setMcpServers] = useState<Record<string, McpServerInfo>>(initialMcpServers);
    const [isLoading, setIsLoading] = useState(false);

    // Memoize MCP scopes extraction to avoid recalculation
    const mcpScopes = useMemo(
        () => oauth.clientScopesRequested
            .filter(scope => scope.dynamicScopeParameter)
            .map(scope => `${MCP_SCOPE_PREFIX}${scope.dynamicScopeParameter}`),
        [oauth.clientScopesRequested]
    );

    // Check if we already have initial data
    const hasInitialData = useMemo(
        () => Object.keys(initialMcpServers).length > 0,
        [initialMcpServers]
    );

    // Fetch MCP server info from Keycloak REST endpoint (skip if already have data from kcContext)
    useEffect(() => {
        // Skip if no MCP scopes or already have data from kcContext
        if (mcpScopes.length === 0 || hasInitialData) return;

        const fetchMcpServers = async () => {
            setIsLoading(true);

            // Build endpoint: /realms/{realm}/mcp/servers?scopes=...
            const realmMatch = url.loginAction.match(/\/realms\/([^/]+)\//);
            if (!realmMatch) return;

            const realm = realmMatch[1];
            const baseUrl = url.loginAction.split(`/realms/${realm}/`)[0];
            const scopesParam = mcpScopes.join(",");
            const endpoint = `${baseUrl}/realms/${realm}/mcp/servers?scopes=${encodeURIComponent(scopesParam)}`;

            const response = await fetch(endpoint, { credentials: "include" });
            const data = await response.json();
            setMcpServers(data.servers);
            setIsLoading(false);
        };

        fetchMcpServers();
    }, [mcpScopes, hasInitialData, url.loginAction]);

    const clientName = client.name ? advancedMsgStr(client.name) : client.clientId;

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
                        {/* Dynamic scopes from OAuth request */}
                        {oauth.clientScopesRequested.map((scope, index) => {
                            const serverInfo = scope.dynamicScopeParameter
                                ? mcpServers[scope.dynamicScopeParameter]
                                : undefined;
                            const isMcpScope = !!scope.dynamicScopeParameter;

                            return isMcpScope ? (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                        ) : (
                                            <Server className="h-5 w-5 text-gray-600" />
                                        )}
                                        <div>
                                            <span className="font-medium text-gray-900">
                                                {serverInfo?.name || scope.dynamicScopeParameter}
                                            </span>
                                            <p className="text-xs text-gray-500">
                                                {advancedMsgStr(scope.consentScreenText)}
                                            </p>
                                        </div>
                                    </div>
                                    {isLoading ? (
                                        <span className="text-sm text-gray-400 px-2 py-1 animate-pulse">
                                            ...
                                        </span>
                                    ) : serverInfo?.pricing != null ? (
                                        <span className="text-sm font-medium text-gray-600">
                                            ${serverInfo.pricing.toFixed(2)} / request
                                        </span>
                                    ) : null}
                                </div>
                            ) : (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>{advancedMsgStr(scope.consentScreenText)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>


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
