import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../KcContext";
import type { I18n } from "../../../i18n";
import { clsx } from "keycloakify/tools/clsx";
import { primaryButtonClass } from "../../../buttonClasses";

export default function Invitations(props: PageProps<Extract<KcContext, { pageId: "invitations.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msgStr } = i18n;

    const { invitations, url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            displayRequiredFields={false}
            displayMessage={false}
            headerNode={msgStr("p2incOrgsTitle")}
        >
            <div>
                <div id="kc-terms-text">
                    {msgStr("p2incOrgsText")}
                </div>
                <form className="form-actions" action={url.loginAction} method="POST">
                    {invitations.orgs.map((org, index) => (
                        <div key={index} className="checkbox">
                            <label>
                                <input id={`org-${org.id}`} name="orgs" type="checkbox" value={org.id} checked className={"accent-primary-600"} /> {org.displayName}
                            </label>
                        </div>))}
                    <input
                        className={clsx(
                            kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                            primaryButtonClass,
                            "w-full cursor-pointer flex justify-center relative"
                        )}
                        name="accept"
                        id="kc-accept"
                        type="submit"
                        value={msgStr("doAccept")}
                    />
                </form>
                <div className="clearfix"></div>
            </div>
        </Template>
    );
}