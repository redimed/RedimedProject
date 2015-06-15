#oi.multiselect — AngularJS directive of select element

## Features

* API compatible with [Angular select](http://docs.angularjs.org/api/ng/directive/select)
* Angular 1.2+ without jQuery and other dependencies
* search options by substring (including the search query to the server)
* use [Bootstrap](http://getbootstrap.com) styles (but you can use own styles)
* 17 KB minified

## Demo

Do you want to see module in action? Visit http://tamtakoe.github.io/oi.multiselect/!

## Installation

You can download files through Bower:

```
npm install -g bower
bower install oi.multiselect
```

or make build:

```
npm install
npm install -g grunt-cli
grunt build
```


Then you need to include into index.html:

```
multiselect.min.css
multiselect.min.js or multiselect-tpls.min.js
```

When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `oi.multiselect` AngularJS module:

```javascript
angular.module('myModule', ['oi.multiselect']);
```

Use `oi-multiselect` directive:

```html
<oi-multiselect
    ng-options="item.name for item in shopArr track by item.id"
    ng-model="bundle"
    multiple
    placeholder="Select"
    ></oi-multiselect>
```

## Attributes
* `ng-options` — see: [ngOptions](http://docs.angularjs.org/api/ng/directive/ngOptions)
  * `ng-options="item for item in shopArrShort | limitTo: 3"` — filter input list
  * `ng-options="item for item in shopArrFn($query, $querySelectAs)"` — generate input list (expects array/object or promise)
* `ng-model` — chosen item/items
* `ng-disabled` — specifies that a drop-down list should be disabled
* `multiple` — specifies that multiple options can be selected at once
* `multiple-limit` — maximum number of options that can be selected at once
* `readonly` — specifies that an input field is read-only
* `notempty` — specifies that an input field can't be empty
* `autofocus` — specifies that an input field should automatically get focus when the page loads
* `oi-multiselect-options` — object with options. You can override them in `oiMultiselectProvider.options`
  * `debounce` — timeout of debounced input field (default: 500). Set only if `value` is function which return promise
  * `searchFilter` — filter name for items in search field
  * `dropdownFilter` — filter name for items in dropdown
  * `listFilter` — filter name for items order in dropdown
  * `saveLastQuery` — function which get `lastQuery` and `removedValue` and return string for input after element was removed (default: '')
  * `saveTrigger` — Trigger on which element is stored in the model. May be `enter`, `backslash`, `blur` (default: `enter`, `backslash`)
  * `newItem` — Mode of adding new items from query (default: false). May be `autocomplete` (priority save matches), `prompt` (priority save new item)
  * `newItemModel` — New items model (default: model = query). `$query` value from model will be changed to query string.
  * `newItemFn` — function which get query and return new item object or promise
