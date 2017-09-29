Package.describe({
    version: '0.0.1',
    name: 'ejianlian:less',
    summary: 'less utils',
});

Package.onUse((api) => {
    api.use('less');

    api.addFiles('./client/app.less', 'client');
    api.addFiles('./client/variable.import.less', 'client');
});
