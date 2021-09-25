import propSep   from '@jf/prop-sep';

const config = {};
let $locale = '';

/**
 * Replaces a `{{value}}` from a context's value. i.e.:
 *      - with context = `{ value : 1234 }` --> `1234`
 * @param   {String}    text    To be edited
 * @param   {Object}    context To apply into text
 * @return  {String}    Text with each key replaced
 * @private
 */
const _replace = (text = '', context = {}) =>
    text.replace(
        /(\{+[\w]+\}+)/g,
        match => context[match.replace(/[{}]+/g, '')]);

/**
 * Tries to recover the value of key in current collection
 * @param   {String}        key     To retrieve
 * @param   {Object}        context To apply
 * @param   {Number}        order   From the possible values of the key
 * @return  {String|Array}  Value of key in collection
 * @private
 */
const _tr = (key = '', context = {}, order = -1) =>
{
    let value = propSep.get(config, `${$locale}.${key}`);

    if (Array.isArray(value) && order !== -1 && order <= value.length)
    {
        value = value[order];
    }

    return typeof value === 'string'
        ? _replace(value, context)
        : key;
};

/**
 * Tries to recover the value of key in current collection
 * @param   {String}    key     To retrieve
 * @param   {Number}    order   In key's value, index of the text to retrieve
 * @param   {Object}    context To apply
 * @return  {String}    Value of key in collection
 * @private
 */
const _trn = (key = '', order = 0, context = {}) =>
    _tr(key, context, order);

/**
 * Adds a new configuration
 * @param   {String}    locale      Location identifier
 * @param   {Object}    collection  Collection of translations
 * @private
 */
const _add = (locale = '', collection = {}) =>
    propSep.set(config, locale, collection)

/**
 * Defines the locale collection to use
 * @param   {String}    locale  New locale
 * @private
 */
const _use = (locale = '') =>
{
    $locale = ($locale !== locale && !!config[$locale]) ? locale : $locale;
};

/**
 * Configures a new locale collection and starts using it
 * @param   {String}    locale      Collection identifier
 * @param   {Object}    collection  Collection of texts
 * @private
 */
const _config = (locale = '', collection = {}) =>
{
    _add(locale, collection);
    _use(locale);
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

        Object.defineProperty(_vue.prototype, '$_tr', { value : (key = '', context = {}) => _tr(key, context) });
        Object.defineProperty(_vue.prototype, '$_trn', { value : (key = '', order = 0, context = {}) => _trn(key, order, context) });
        Object.defineProperty(_vue.prototype, '$_i18n', {
            value : {
                add       : _add,
                tr        : _tr,
                trn       : _trn,
                config    : _config,
                use       : _use,
                available : () => Object.keys(config).sort()
            }
        });
        Object.defineProperty(_vue.prototype.$_i18n, 'current', { get : () => $locale });
    }
};
