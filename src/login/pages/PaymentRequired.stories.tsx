import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "payment-required.ftl" });

const meta = {
    title: "login/payment-required.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default:
 * - Purpose: Tests the default payment info needed page.
 * - Scenario: User needs to add a payment method before continuing.
 */
export const Default: Story = {
    render: () => <KcPageStory />
};

/**
 * WithError:
 * - Purpose: Tests the payment info needed page with an error message.
 * - Scenario: User returned from checkout but payment was not completed.
 */
export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "error",
                    summary: "Payment method not found. Please complete the checkout process."
                }
            }}
        />
    )
};

