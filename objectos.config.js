
// 使用 defineConfig 获得类型提示
export default {
  // 1. 基础信息
  name: "My Enterprise App",
  
  datasource: {
    default: {
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/objectos',
    }
  },
  // 2. 预设 (Presets) - 这里定义你要加载哪些现成的业务包
  // 逻辑：Kernel 会去 node_modules 里找这些包，并加载其中的 objects 目录
  presets: [
    '@objectos/preset-base',    // 基础包 (User, Role)
  ],

  // 3. 插件 (Plugins) - 这里定义你要启用的逻辑能力
  plugins: [
    ['@objectos/plugin-storage', { driver: 's3' }]
  ],

  // 4. 本地对象目录 (Local Objects)
  // 除了预设，你本地定义的 .object.yml 放在哪里
  // directories: [
  //   './objects',
  // ]
};