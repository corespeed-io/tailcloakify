import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

// Mock kcContext to simulate real environment
const mockKcContext = {
    url: {
        oauthAction: "/oauth-action"
    },
    oauth: {
        clientScopesRequested: [],
        code: "mockCode"
    },
    client: {
        attributes: {
            mcpServer: "Playwright MCP",
            mcpPricing: "$0.1 / request"
        },
        name: "mcp-gateway",
        clientId: "mcp-gateway"
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
