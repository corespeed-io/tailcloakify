import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, CircleX, Info, Languages } from "lucide-react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import useSetCookieConsent from "./useSetCookieConsent.tsx";
import corespeedLogo from "./assets/logo/corespeed.svg";
import corespeedIcon from "./assets/logo/corespeed-icon.svg";
import { secondaryButtonClass } from "./buttonClasses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Boxes } from "@/components/ui/background-boxes.tsx";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, advancedMsgStr, currentLanguage, enabledLanguages } = i18n;

    const { auth, url, message, isAppInitiatedAction } = kcContext;

    const currentLanguageTag =
        (currentLanguage as { languageTag?: string; tag?: string }).languageTag ?? (currentLanguage as { languageTag?: string; tag?: string }).tag;

    const languageOptions = enabledLanguages.map(({ languageTag, label, href }, index) => ({
        value: languageTag ?? `${label}-${index}`,
        label,
        href,
        languageTag
    }));

    const currentLanguageOption =
        languageOptions.find(
            option => (option.languageTag !== undefined && option.languageTag === currentLanguageTag) || option.label === currentLanguage.label
        ) ?? languageOptions[0];

    const selectedLanguageValue = currentLanguageOption?.value ?? "";

    const handleLanguageChange = (value: string) => {
        const selected = languageOptions.find(option => option.value === value);
        if (selected) {
            window.location.assign(selected.href);
        }
    };

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    // Load Favicon
    useEffect(() => {
        const url: string | undefined =
            (advancedMsgStr("faviconUrl") !== "faviconUrl" ? advancedMsgStr("faviconUrl") : null) || kcContext.properties.TAILCLOAKIFY_FAVICON_URL;

        if (url) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }
            link.href = url;
        }
    });

    // Load Scripts & Cookie Consent
    useEffect(() => {
        const promisses: Promise<void>[] = [];

        function loadScript(src: string) {
            return new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
        }

        if (kcContext.properties["TAILCLOAKIFY_ADDITIONAL_SCRIPTS"]) {
            const scriptUrls = kcContext.properties["TAILCLOAKIFY_ADDITIONAL_SCRIPTS"].split(";"); // Split the URLs by semicolon
            scriptUrls.forEach(url => promisses.push(loadScript(url)));
        }

        if (kcContext.properties["TAILCLOAKIFY_ADDITIONAL_SCRIPTS"]) {
            const scriptUrls = kcContext.properties["TAILCLOAKIFY_ADDITIONAL_SCRIPTS"].split(";"); // Split the URLs by semicolon
            scriptUrls.forEach(url => promisses.push(loadScript(url)));
        }

        if (kcContext.properties["scripts"]) {
            const scriptUrls = kcContext.properties["scripts"].split(" "); // Split the URLs by space
            scriptUrls.forEach(url => promisses.push(loadScript(url)));
        }

        Promise.all(promisses).then(() => {
            if (window.CookieConsent === undefined && kcContext.properties["TAILCLOAKIFY_FOOTER_ORESTBIDACOOKIECONSENT"])
                useSetCookieConsent(kcContext, i18n);
        });
    }, []);

    // Load CSS
    useEffect(() => {
        function loadStyle(href: string) {
            const elem = document.createElement("link");
            elem.href = href;
            elem.rel = "stylesheet";
            document.head.appendChild(elem);
        }

        if (kcContext.properties["TAILCLOAKIFY_ADDITIONAL_STYLES"]) {
            const styleUrls = kcContext.properties["TAILCLOAKIFY_ADDITIONAL_STYLES"].split(";"); // Split the URLs by semicolon
            styleUrls.forEach(loadStyle);
        }

        if (kcContext.properties["styles"]) {
            const styleUrls = kcContext.properties["styles"].split(" "); // Split the URLs by space
            styleUrls.forEach(loadStyle);
        }
    }, []);

    // Load Meta
    useEffect(() => {
        function loadMeta(input: { name: string; content: string }) {
            const elem = document.createElement("meta");
            elem.name = input.name;
            elem.content = input.content;
            document.head.appendChild(elem);
        }

        if (kcContext.properties["TAILCLOAKIFY_ADDITIONAL_META"]) {
            const metaStrings = kcContext.properties["TAILCLOAKIFY_ADDITIONAL_META"].split(";"); // Split the semicolon by space & ==
            const metaRows = metaStrings.map(e => ({ name: e.split("==")[0], content: e.split("==")[1] }));
            metaRows.forEach(loadMeta);
        }

        if (kcContext.properties["meta"]) {
            const metaStrings = kcContext.properties["meta"].split(" "); // Split the entries by space & ==
            const metaRows = metaStrings.map(e => ({ name: e.split("==")[0], content: e.split("==")[1] }));
            metaRows.forEach(loadMeta);
        }
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const footerImprintUrl = advancedMsgStr("footerImprintUrl") !== "footerImprintUrl" ? advancedMsgStr("footerImprintUrl") : null;
    const footerDataprotectionUrl =
        advancedMsgStr("footerDataprotectionUrl") !== "footerDataprotectionUrl" ? advancedMsgStr("footerDataprotectionUrl") : null;

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div
            className={clsx(
                kcClsx("kcLoginClass"),
                "bg-secondary-100 flex flex-col items-center justify-center min-h-screen sm:py-16 overflow-x-hidden"
            )}
        >
            <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(transparent,white)] pointer-events-none z-10" />
            <div className="absolute h-full w-full overflow-hidden">
                <Boxes className="opacity-10 z-0" />
            </div>

            <img src={corespeedLogo} alt="Corespeed Logo" className="invisible md:visible absolute top-4 left-8 h-8 w-auto z-20 pointer-events-none" />

            <div id="kc-header" className="z-20">
                <img src={corespeedIcon} alt="Corespeed Logo" className="h-16 w-auto -mb-5 pointer-events-none" />
            </div>

            <div className={clsx(kcClsx("kcFormCardClass"), "relative z-30 max-w-md w-full shadow-none bg-transparent")}>
                <header className={clsx(kcClsx("kcFormHeaderClass"))}>
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 id="kc-page-title" className={"text-center text-xl mb-2"}>
                                {headerNode}
                            </h1>
                        ) : (
                            <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <div className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    {/*Relocated to Register.tsx, so that it appears below the Register button*/}
                                    {/*<div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>*/}
                                    {/*    <span className="subtitle">*/}
                                    {/*        <span className="required">*</span>*/}
                                    {/*        {msg("requiredFields")}*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    <div>{node}</div>
                                </div>
                            );
                        }
                        return node;
                    })()}
                </header>
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div
                                className={clsx(
                                    `alert-${message.type}`,
                                    kcClsx("kcAlertClass"),
                                    `pf-m-${message?.type === "error" ? "danger" : message.type}`,
                                    "p-4 rounded-lg text-sm mb-4 border-transparent"
                                )}
                            >
                                <div className="pf-c-alert__icon mr-3 flex items-center justify-center">
                                    {message.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />}
                                    {message.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />}
                                    {message.type === "error" && <CircleX className="h-5 w-5 text-red-500" aria-hidden="true" />}
                                    {message.type === "info" && <Info className="h-5 w-5 text-sky-500" aria-hidden="true" />}
                                </div>
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </div>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="mt-3">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <button
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                        className={clsx(secondaryButtonClass, "w-full flex justify-center relative")}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </button>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <div className={"space-y-4"}>
                                <div id="kc-info-wrapper">{infoNode}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"flex justify-around"}></div>
            </div>
            <footer className={"flex justify-between max-w-md w-full mt-8 relative px-10"}>
                <section className={"flex flex-col"}>
                    {(footerImprintUrl || kcContext.properties["TAILCLOAKIFY_FOOTER_IMPRINT_URL"]) && (
                        <a
                            className={"text-secondary-600 hover:text-secondary-900 text-sm inline-flex no-underline hover:no-underline"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            href={footerImprintUrl || kcContext.properties["TAILCLOAKIFY_FOOTER_IMPRINT_URL"]}
                        >
                            {msg("footerImprintTitle")}
                        </a>
                    )}
                    {(footerDataprotectionUrl || kcContext.properties["TAILCLOAKIFY_FOOTER_DATAPROTECTION_URL"]) && (
                        <a
                            className={"text-secondary-600 hover:text-secondary-900 text-sm inline-flex no-underline hover:no-underline"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            href={footerDataprotectionUrl || kcContext.properties["TAILCLOAKIFY_FOOTER_DATAPROTECTION_URL"]}
                        >
                            {msg("footerDataProtectionTitle")}
                        </a>
                    )}
                    {kcContext.properties["TAILCLOAKIFY_FOOTER_ORESTBIDACOOKIECONSENT"] && (
                        <a
                            className={"text-secondary-600 hover:text-secondary-900 text-sm inline-flex no-underline hover:no-underline"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            type={"button"}
                            onClick={() => window?.CookieConsent?.showPreferences()}
                        >
                            {msg("footerCookiePreferencesTitle")}
                        </a>
                    )}
                </section>

                <section className="relative w-32">
                    {enabledLanguages.length > 1 && selectedLanguageValue && (
                        <div className={clsx(kcClsx("kcLocaleMainClass"), "relative z-40 min-w-[11rem]")} id="kc-locale">
                            <div id="kc-locale-wrapper" className={clsx(kcClsx("kcLocaleWrapperClass"), "relative")}>
                                <Select value={selectedLanguageValue} onValueChange={handleLanguageChange}>
                                    <SelectTrigger aria-label={msgStr("languages")} className="flex items-center gap-2 bg-white w-32 shadow-none">
                                        <Languages className="h-4 w-4" aria-hidden="true" />
                                        <SelectValue placeholder={currentLanguage.label ?? msgStr("languages")} />
                                    </SelectTrigger>
                                    <SelectContent className="shadow-sm">
                                        {languageOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </section>
            </footer>
        </div>
    );
}
