import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

// Mock kcContext to simulate real environment
const mockKcContext = {
    url: {
        oauthAction: "/oauth-action"
    },
    oauth: {
        clientScopesRequested: [
            {
                consentScreenText: "Sign in with your account",
                dynamicScopeParameter: undefined
            },
            {
                consentScreenText: "Access MCP server",
                dynamicScopeParameter: "playwright"
            }
        ],
        code: "mockCode"
    },
    client: {
        attributes: {},
        name: "mcp-gateway",
        clientId: "mcp-gateway"
    },
    mcpServers: {
        playwright: {
            name: "Playwright MCP",
            pricing: "$0.10 / request"
        }
    }
};

const { KcPageStory } = createKcPageStory({ pageId: "login-oauth-grant.ftl" });

const meta = {
    title: "login/login-oauth-grant.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default:
 * - Purpose: Tests the default consent page with CoreSpeed logo.
 * - Scenario: No custom logo, uses default CoreSpeed icon.
 */
export const Default: Story = {
    render: () => <KcPageStory kcContext={mockKcContext} />
};

/**
 * WithCustomLogo:
 * - Purpose: Tests the consent page with a custom client logo.
 * - Scenario: Client has a logoUri configured.
 */
export const WithCustomLogo: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                ...mockKcContext,
                client: {
                    ...mockKcContext.client,
                    name: "Claude Desktop",
                    clientId: "claude-desktop",
                    attributes: {
                        logoUri: "https://www.anthropic.com/images/icons/apple-touch-icon.png",
                        mcpServer: "Playwright MCP",
                        mcpPricing: "$0.1 / request"
                    }
                }
            }}
        />
    )
};

/**
 * WithTermsAndPrivacy:
 * - Purpose: Tests the consent page with terms and privacy links.
 * - Scenario: Client has tosUri and policyUri configured.
 */
export const WithTermsAndPrivacy: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                ...mockKcContext,
                client: {
                    ...mockKcContext.client,
                    attributes: {
                        tosUri: "https://corespeed.io/terms",
                        policyUri: "https://corespeed.io/privacy"
                    }
                }
            }}
        />
    )
};

/**
 * WithMultipleMCPServers:
 * - Purpose: Tests the consent page with multiple dynamic MCP server scopes.
 * - Scenario: User is requesting access to multiple MCP servers at once.
 */
export const WithMultipleMCPServers: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                ...mockKcContext,
                oauth: {
                    ...mockKcContext.oauth,
                    clientScopesRequested: [
                        {
                            consentScreenText: "Sign in with your account",
                            dynamicScopeParameter: undefined
                        },
                        {
                            consentScreenText: "Access MCP server",
                            dynamicScopeParameter: "playwright"
                        },
                        {
                            consentScreenText: "Access MCP server",
                            dynamicScopeParameter: "github"
                        },
                        {
                            consentScreenText: "Access MCP server",
                            dynamicScopeParameter: "slack"
                        }
                    ]
                },
                client: {
                    ...mockKcContext.client,
                    name: "Claude Desktop",
                    clientId: "claude-desktop",
                    attributes: {
                        logoUri: "https://www.anthropic.com/images/icons/apple-touch-icon.png"
                    }
                },
                mcpServers: {
                    playwright: {
                        name: "Playwright MCP",
                        pricing: "$0.10 / request"
                    },
                    github: {
                        name: "GitHub MCP",
                        pricing: "$0.05 / request"
                    },
                    slack: {
                        name: "Slack MCP",
                        pricing: "$0.02 / request"
                    }
                }
            }}
        />
    )
};
