export default {
    datasource: {
        default: {
            type: 'sqlite',
            filename: 'objectos.db'
        }
    },
    presets: [
        '@objectos/preset-base',
        '@objectql/starter-basic',
        '@objectql/starter-enterprise'
    ]
};
