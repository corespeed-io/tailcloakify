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
            slug: "playwright",
            name: "Playwright MCP",
            pricing: 0.10
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
 * WithoutScopes:
 * - Purpose: Tests the component when no OAuth scopes are requested.
 * - Scenario: The component renders with no scopes listed under the consent screen.
 * - Key Aspect: Ensures the component renders correctly when there are no requested scopes.
 */
export const WithoutScopes: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                ...mockKcContext,
                oauth: {
                    ...mockKcContext.oauth,
                    clientScopesRequested: []
                }
            }}
        />
    )
};

/**
 * WithFormSubmissionError:
 * - Purpose: Tests how the component handles form submission errors.
 * - Scenario: The `oauthAction` URL is set to an error route and an error message is displayed.
 * - Key Aspect: Ensures that the component can display error messages when form submission fails.
 */
export const WithFormSubmissionError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                ...mockKcContext,
                url: {
                    oauthAction: "/error"
                },
                message: {
                    type: "error",
                    summary: "An error occurred during form submission."
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
                        slug: "playwright",
                        name: "Playwright MCP",
                        pricing: 0.10
                    },
                    github: {
                        slug: "github",
                        name: "GitHub MCP",
                        pricing: 0.05
                    },
                    slack: {
                        slug: "slack",
                        name: "Slack MCP",
                        pricing: 0.02
                    }
                }
            }}
        />
    )
};
