import i18nPlugin from '@/plugins/i18n';
import Vue        from 'vue';

const enGB = {
    labels : {
        simple   : 'Simple label',
        complex  : 'Hello {{user}}!',
        multiple : [ 'Hello', 'World', '{{user}}!' ]
    }
};

const esES = {
    labels : {
        simple   : 'Etiqueta simple',
        complex  : 'Hola {{user}}!',
        multiple : [ 'Hola', 'Mundo', '{{user}}!' ]
    }
};

Vue.use(i18nPlugin, { locale : 'enGB', collection : enGB });

describe('i18n Plugin', () =>
{
    describe('Is installed as expected', () =>
    {
        it('Vue.prototype.$_tr exists', () => expect(Vue.prototype.$_tr).toBeInstanceOf(Function));
        it('Vue.prototype.$_trn exists', () => expect(Vue.prototype.$_trn).toBeInstanceOf(Function));
        it('Vue.prototype.$_i18n exists', () => expect(Vue.prototype.$_trn).toBeInstanceOf(Object));
    });

    describe('$_tr works as expected', () =>
    {
        it('For "labels.simple", returns "Simple label"', () =>
            expect(Vue.prototype.$_tr('labels.simple')).toBe(enGB.labels.simple));

        it('For "labels.complex" and user "Foo", returns "Hello Foo!"', () =>
            expect(Vue.prototype.$_tr('labels.complex', { user : 'Foo' })).toBe('Hello Foo!'));

        it('For "labels.multiple" return the array of values', () =>
            expect(Vue.prototype.$_tr('labels.multiple')).toEqual(enGB.labels.multiple));
    });

    describe('$_trn works as expected', () =>
    {
        it('For "labels.multiple" and order 0, returns "Hello"', () =>
            expect(Vue.prototype.$_trn('labels.multiple', 0)).toBe(enGB.labels.multiple[0]));

        it('For "labels.multiple" and order 1, returns "World"', () =>
            expect(Vue.prototype.$_trn('labels.multiple', 1)).toBe(enGB.labels.multiple[1]));

        it('For "labels.multiple", order 2 and context { \"user\": \"Foo\" }, returns "Foo!"', () =>
            expect(Vue.prototype.$_trn('labels.multiple', 2, { user : 'Foo' })).toBe('Foo!'));
    });

    describe('$_i18n other methods', () =>
    {
        it('@get.current returns "enGB"', () =>
        {
            expect(Vue.prototype.$_i18n.current).toBe('enGB');
        });

        it('config() defines a new collection', () =>
        {
            Vue.prototype.$_i18n.config('esES', esES);
            expect(Vue.prototype.$_i18n.current).toBe('esES');
            expect(Vue.prototype.$_tr('labels.simple')).toBe(esES.labels.simple);
        });

        it('use() changes the collection in use', () =>
        {
            Vue.prototype.$_i18n.use('enGB');
            expect(Vue.prototype.$_tr('labels.simple')).toBe(enGB.labels.simple);
        });

        it('available() returns the locales configured', () =>
        {
            expect(Vue.prototype.$_i18n.available()).toEqual(['enGB', 'esES']);
        });
    });
});
