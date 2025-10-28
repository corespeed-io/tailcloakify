import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AlertTriangle, Check, CheckCircle2, ChevronDown, CircleX, Info, Languages } from "lucide-react";
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

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
    const localeMenuRef = useRef<HTMLDivElement | null>(null);
    const localeListRef = useRef<HTMLUListElement | null>(null);
    const localeListId = "language-switch";
    const currentLanguageTag =
        (currentLanguage as { languageTag?: string; tag?: string }).languageTag ??
        (currentLanguage as { languageTag?: string; tag?: string }).tag;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useEffect(() => {
        if (enabledLanguages.length <= 1 && isLocaleMenuOpen) {
            setIsLocaleMenuOpen(false);
        }
    }, [enabledLanguages.length, isLocaleMenuOpen]);

    useEffect(() => {
        if (!isLocaleMenuOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (!localeMenuRef.current?.contains(event.target as Node)) {
                setIsLocaleMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsLocaleMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isLocaleMenuOpen]);

    useEffect(() => {
        if (!isLocaleMenuOpen) {
            return;
        }

        const activeOption = localeListRef.current?.querySelector('[aria-selected="true"]') as HTMLElement | null;
        const firstOption = localeListRef.current?.querySelector('[role="option"]') as HTMLElement | null;

        (activeOption ?? firstOption)?.focus?.();
    }, [isLocaleMenuOpen]);

    function handleLocaleListKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
        if (!localeListRef.current) {
            return;
        }

        const options = Array.from(localeListRef.current.querySelectorAll<HTMLAnchorElement>('[role="option"]'));

        if (options.length === 0) {
            return;
        }

        const currentIndex = options.findIndex(option => option === document.activeElement);

        const focusOption = (index: number) => {
            const option = options[index];
            option?.focus();
        };

        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % options.length : 0;
                focusOption(nextIndex);
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + options.length) % options.length : options.length - 1;
                focusOption(prevIndex);
                break;
            }
            case "Home": {
                event.preventDefault();
                focusOption(0);
                break;
            }
            case "End": {
                event.preventDefault();
                focusOption(options.length - 1);
                break;
            }
            case "Escape": {
                setIsLocaleMenuOpen(false);
                break;
            }
            default:
                break;
        }
    }

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

    const backgroundLogoUrl = advancedMsgStr("backgroundLogoUrl") !== "backgroundLogoUrl" ? advancedMsgStr("backgroundLogoUrl") : null;
    const backgroundVideoUrl = advancedMsgStr("backgroundVideoUrl") !== "backgroundVideoUrl" ? advancedMsgStr("backgroundVideoUrl") : null;

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
            <div id="kc-header">
                {(backgroundLogoUrl || kcContext.properties["TAILCLOAKIFY_BACKGROUND_LOGO_URL"]) && (
                    <img
                        alt={"Logo"}
                        src={backgroundLogoUrl || kcContext.properties["TAILCLOAKIFY_BACKGROUND_LOGO_URL"]}
                        className={"fixed z-10 top-4 left-8"}
                    />
                )}
                {(backgroundVideoUrl || kcContext.properties["TAILCLOAKIFY_BACKGROUND_VIDEO_URL"]) && (
                    <video
                        autoPlay={true}
                        loop={true}
                        muted={true}
                        playsInline={true}
                        className={"fixed top-0 left-0 right-0 bottom-0 min-h-full min-w-full opacity-20 max-w-none"}
                    >
                        <source src={backgroundVideoUrl || kcContext.properties["TAILCLOAKIFY_BACKGROUND_VIDEO_URL"]} type="video/mp4" />
                    </video>
                )}
            </div>

            <img src={corespeedLogo} alt="Corespeed Logo" className="h-10 w-auto z-10 mb-4" />
            <div className={clsx(kcClsx("kcFormCardClass"), "relative z-10 max-w-md w-full rounded-xl shadow-lg")}>
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
                                    {message.type === "success" && (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                                    )}
                                    {message.type === "warning" && (
                                        <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                                    )}
                                    {message.type === "error" && (
                                        <CircleX className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    )}
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
                                        className="bg-secondary-100 text-secondary-600 focus:ring-secondary-600 hover:bg-secondary-200 hover:text-secondary-900 px-4 py-2 text-sm flex justify-center relative rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-offset-2"
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
            <footer className={"flex justify-between max-w-md w-full mt-8 relative"}>
                <section className={"flex flex-col ml-5"}>
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

                <section className="relative">
                    {enabledLanguages.length > 1 && (
                        <div className={clsx(kcClsx("kcLocaleMainClass"), "relative overflow-visible z-40")} id="kc-locale">
                            <div
                                id="kc-locale-wrapper"
                                ref={localeMenuRef}
                                className={clsx(kcClsx("kcLocaleWrapperClass"), "relative")}
                            >
                                <button
                                    type="button"
                                    id="kc-current-locale-link"
                                    aria-label={msgStr("languages")}
                                    aria-haspopup="listbox"
                                    aria-expanded={isLocaleMenuOpen}
                                    aria-controls={localeListId}
                                    onClick={() => setIsLocaleMenuOpen(value => !value)}
                                    className={clsx(
                                        "flex items-center gap-2 rounded-lg border border-secondary-200 bg-white/90 px-3 py-2 text-sm font-medium text-secondary-700 shadow-sm backdrop-blur transition",
                                        "hover:border-primary-300 hover:text-primary-700 focus:outline-none focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 after:hidden"
                                    )}
                                >
                                    <Languages className="h-4 w-4 opacity-80" aria-hidden="true" />
                                    <span className="truncate max-w-[8rem] text-left">{currentLanguage.label}</span>
                                    <ChevronDown
                                        className={clsx("h-4 w-4 transition-transform", isLocaleMenuOpen && "rotate-180")}
                                        aria-hidden="true"
                                    />
                                </button>
                                <ul
                                    id={localeListId}
                                    role="listbox"
                                    aria-labelledby="kc-current-locale-link"
                                    ref={localeListRef}
                                    onKeyDown={handleLocaleListKeyDown}
                                    className={clsx(
                                        kcClsx("kcLocaleListClass"),
                                        "block absolute end-0 mb-2 w-56 origin-bottom-right border border-secondary-200 rounded-lg bg-white p-1 shadow-lg",
                                        "transform transition ease-out duration-150",
                                        isLocaleMenuOpen
                                            ? "pointer-events-auto -translate-y-[calc(100%+30px)] opacity-100"
                                            : "pointer-events-none translate-y-0 opacity-0"
                                    )}
                                    style={{ display: isLocaleMenuOpen ? "block" : "none" }}
                                >
                                    {enabledLanguages.map(({ languageTag, label, href }, index) => {
                                        const isActive =
                                            (currentLanguageTag !== undefined && languageTag === currentLanguageTag) ||
                                            label === currentLanguage.label;

                                        return (
                                            <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                <a
                                                    role="option"
                                                    aria-selected={isActive}
                                                    id={`language-${index + 1}`}
                                                    className={clsx(
                                                        kcClsx("kcLocaleItemClass"),
                                                        "flex items-center justify-between gap-3 px-3 py-2 text-sm text-secondary-700 transition focus:outline-none",
                                                        isActive
                                                            ? "bg-primary-50 font-semibold text-primary-700"
                                                            : "hover:bg-secondary-100 hover:text-secondary-900"
                                                    )}
                                                    href={href}
                                                    tabIndex={-1}
                                                    onClick={() => setIsLocaleMenuOpen(false)}
                                                >
                                                    <span className="truncate">{label}</span>
                                                    {isActive && <Check className="h-4 w-4 text-primary-600" aria-hidden="true" />}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </section>
            </footer>
        </div>
    );
}
