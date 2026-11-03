export function resolveWizardStepperValidation({
    incompleteSteps = [],
    currentStep,
    stepErrors = {},
    validateStepFor
}) {
    const nextIncomplete = incompleteSteps.filter((step) => {
        const result = validateStepFor(step);
        return !result?.valid;
    });

    const shouldRefreshCurrentErrors =
        incompleteSteps.includes(currentStep) ||
        Object.keys(stepErrors || {}).length > 0;

    if (!shouldRefreshCurrentErrors) {
        return {
            incompleteSteps: nextIncomplete,
            stepErrors: stepErrors || {}
        };
    }

    const currentResult = validateStepFor(currentStep);
    return {
        incompleteSteps: nextIncomplete,
        stepErrors: currentResult?.errors || {}
    };
}
