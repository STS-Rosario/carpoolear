export function rememberMaxContributionWarning({
    hasBeenShown,
    hasExceededMaxContribution
}) {
    return hasBeenShown || hasExceededMaxContribution;
}
