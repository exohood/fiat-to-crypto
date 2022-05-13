const countryLanguagePairings: {[key: string]: string} = {
    JP: 'ja',
    KR: 'ko',
    // Undefined countries will use the default language defined below.
};
export const defaultLanguage = 'en';

/**
 * Will return the code for the default language spoken in the provided country.
 *
 * @param country The Alpha-2 ISO 3166 country code. E.g. 'JP'. See:
 * https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
 * @returns The ISO 639-1 language code. E.g. 'ja'. See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
export function getDefaultLanguageForCountry(country?: string) {
    return countryLanguagePairings[country ? country.toUpperCase() : ''] ?? defaultLanguage;
}

// A list of the languages supported by Onramper currently (in the ISO 639-1 language code format).
export const supportedLanguages: string[] = [...new Set(Object.values(countryLanguagePairings)).add(defaultLanguage)]

/**
 * Returns whether the language provided is supported by the i18n implementation.
 *
 * @param language The ISO 639-1 language code. E.g. 'ja'. See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 * @returns A boolean indicating whether or not the widget has i18n support for the language
 */
export function isLanguageSupported(language: string) {
    return supportedLanguages.includes(language);
}