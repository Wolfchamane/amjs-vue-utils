import propSep   from '@jf/prop-sep';
import templater from '@amjs/templater';

const config = {};
let $locale = '';

/**
 * Tries to recover the value of key in current collection
 * @param   {String}        key     To retrieve
 * @param   {Object}        context To apply
 * @returns {String|Array}  Value of key in collection
 */
const $_tr = (key = '', context = {}) =>
{
    const value = propSep.get(config, `${$locale}.${key}`);
    return !Array.isArray(value) && typeof value === 'string'
        ? templater(value, context)
        : value;
};

/**
 * Tries to recover the value of key in current collection
 * @param   {String}    key     To retrieve
 * @param   {Number}    order   In key's value, index of the text to retrieve
 * @param   {Object}    context To apply
 * @returns {String}    Value of key in collection
 */
const $_trn = (key = '', order = 0, context = {}) =>
{
    return templater($_tr(key)[order], context);
};

/**
 * Defines the locale collection to use
 * @param   {String}    locale  New locale
 */
const $_use = (locale = '') =>
{
    $locale = ($locale !== locale && !!config[$locale]) ? locale : $locale;
};

/**
 * Configures a new locale collection and starts using it
 * @param   {String}    locale      Collection identifier
 * @param   {Object}    collection  Collection of texts
 */
const $_config = (locale = '', collection = {}) =>
{
    propSep.set(config, locale, collection);
    $_use(locale);
};

export default {
    /**
     * Vue plugin installer
     * @see     https://vuejs.org/v2/guide/plugins.html#Writing-a-Plugin
     * @param   {Object}    _vue        Vue instance
     * @param   {String}    locale      Default collection identifier
     * @param   {Object}    collection  Of texts
     */
    install(_vue = {}, { locale = 'enEN', collection = {} })
    {
        propSep.set(config, locale, collection);
        $locale = $locale || locale;

        Object.defineProperty(_vue.prototype, '$_tr', { value : (key = '', context = {}) => $_tr(key, context) });
        Object.defineProperty(_vue.prototype, '$_trn', { value : (key = '', order = 0, context = {}) => $_trn(key, order, context) });
        Object.defineProperty(_vue.prototype, '$_i18n', {
            value : {
                tr        : $_tr,
                trn       : $_trn,
                config    : $_config,
                use       : $_use,
                available : () => Object.keys(config).sort()
            }
        });
        Object.defineProperty(_vue.prototype.$_i18n, 'current', { get : () => $locale });
    }
};
