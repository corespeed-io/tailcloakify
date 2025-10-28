import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";
import { AlertTriangle } from "lucide-react";
import { primaryButtonClass, secondaryButtonClass } from "../buttonClasses";

export default function DeleteAccountConfirm(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "delete-account-confirm.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, triggered_from_aia } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("deleteAccountConfirm")}>
            <form action={url.loginAction} className="form-vertical" method="post">
                <div className="alert alert-warning flex items-center gap-2" style={{ marginTop: "0", marginBottom: "30px" }}>
                    <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    {msg("irreversibleAction")}
                </div>
                <p>{msg("deletingImplies")}</p>
                <ul
                    style={{
                        color: "#72767b",
                        listStyle: "disc",
                        listStylePosition: "inside"
                    }}
                >
                    <li>{msg("loggingOutImmediately")}</li>
                    <li>{msg("errasingData")}</li>
                </ul>
                <p className="delete-account-text">{msg("finalDeletionConfirmation")}</p>
                <div id="kc-form-buttons" className={"grid grid-cols-2 gap-10"}>
                    <input
                        className={clsx(
                            kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass"),
                            primaryButtonClass,
                            "max-w-md cursor-pointer"
                        )}
                        type="submit"
                        value={msgStr("doConfirmDelete")}
                    />
                    {triggered_from_aia && (
                        <button
                            className={clsx(secondaryButtonClass, "max-w-md")}
                            type="submit"
                            name="cancel-aia"
                            value="true"
                        >
                            {msgStr("doCancel")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}
