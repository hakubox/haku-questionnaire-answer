import Vue, { App } from 'vue';

const components = require.context('../components/', true, /\.(vue|ts|js)$/);

const install = function(vue: App<Element>):void {
  components.keys().forEach(name => {
    const componentName = name.substr(name.lastIndexOf('/') + 1).replace(/\.\/|\.(js|ts|vue)/g, '');
    vue.component(componentName, components(name).default);
  });
};

export default {
    install,
    ...components
};
