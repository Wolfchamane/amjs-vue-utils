# @amjs/vue-utils

![version](https://img.shields.io/npm/v/@amjs/vue-utils?style=flat-square)

Collection of plugins and utils for any VueJS project.

## Installation

```bash
$ npm i --save @amjs/vue-utils
$ npm i --save vue
```

## i18n

Define a collection of texts:

```javascript
// i18n/en_GB.js
export default {
    labels : {
        hello    : 'Hello',
        welcome  : 'Hello {{name}}',
        children : [ 'child', 'children' ]
    }
}
```

```javascript
// i18n/es_ES.js
export default {
    labels : {
        hello    : 'Hola',
        welcome  : 'Hola {{name}}',
        children : [ 'niño', 'niños' ]
    }
}
```

Use plugin to use the default collection:

```javascript
import english        from 'i18n/es_GB';
import { i18nPlugin } from '@amjs/vue-utils';
import Vue            from 'vue';

const locale = 'en_GB';
Vue.use(i18nPlugin, { locale, english });
```

### Add new collections:

```javascript
import spanish from 'i18n/es_ES';

Vue.prototype.$_i18n.add('es_ES', spanish);
```

### Use specific collection:

```javascript
Vue.prototype.$_i18n.use('en_GB');
```

### Configure and use specific collection:

```javascript
import italian from 'i18n/it_IT';

Vue.prototype.$_i18n.config('it_IT', italian);
```

### Using keys:

Use global keys `$_tr` and `$_trn` to obtain collection-in-use text values.

```vue
// Hello.vue
<template>
    <h1>{{$_tr('labels.hello'}}</h1>
    <p>{{$_tr('labels.welcome', { user : 'Foo' })}}</p>
    <p>
        In {{$_i18n.current}} child is "{{$_trn('labels.child', 0)}}".<br/>
        but children is "{{$_trn('labels.child', 1)}}".
    </p>
</template>
```

For example, is current collection-in-use is `es_ES`, above template will render as:

```html
<h1>Hola</h1>
<p>Hola Foo!</p>
<p>
    In es_ES child is "niño".<br/>
    but children is "niños".
</p>
```
