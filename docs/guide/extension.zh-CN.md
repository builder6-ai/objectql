# 对象扩展功能说明

ObjectOS 支持对象属性和字段的重写、扩展和删除功能。

## 功能概述

- ✅ **重写对象属性**：修改 label、icon、description 等
- ✅ **扩展字段**：添加新字段到已有对象
- ✅ **重写字段属性**：修改字段的 required、max_length 等属性
- ✅ **删除字段**：从基础对象中移除字段
- ✅ **深度合并**：支持字段子属性的合并

## 使用语法

### 1. 删除字段

将字段设为 `null` 即可删除：

```yaml
name: user
fields:
  role: null  # 删除 role 字段
```

### 2. 重写字段属性

只需指定要修改的属性，其他属性保持不变：

```yaml
name: product
fields:
  sku:
    required: false  # 只修改 required，其他属性保留
```

### 3. 添加新字段

直接定义新字段：

```yaml
name: user
fields:
  department:  # 新字段
    type: text
    label: 部门
```

### 4. 重写对象属性

```yaml
name: user
label: 系统用户  # 重写 label
description: 扩展的用户对象  # 添加 description
```

## 完整示例

### 基础对象（来自预设包）

```yaml
# @objectos/preset-base/user.object.yml
name: user
label: User
fields:
  name:
    type: text
    required: true
  email:
    type: email
    required: true
  role:
    type: select
    options:
      - label: User
        value: user
      - label: Admin
        value: admin
```

### 扩展对象（应用自定义）

```yaml
# your-app/user.object.yml
name: user
label: 系统用户          # 重写：修改标签
description: 扩展的用户对象  # 扩展：添加描述

fields:
  # 重写：修改 name 字段属性
  name:
    required: false       # 改为可选
    max_length: 100       # 添加长度限制
  
  # 删除：移除 role 字段
  role: null
  
  # 扩展：添加新字段
  department:
    type: text
    label: 部门
  
  phone:
    type: text
    label: 手机号
```

### 合并结果

```yaml
name: user
label: 系统用户
description: 扩展的用户对象
fields:
  name:
    type: text
    required: false      # 已重写
    max_length: 100      # 已添加
  
  email:
    type: email
    required: true       # 保持不变
  
  # role 字段已删除
  
  department:            # 新字段
    type: text
    label: 部门
  
  phone:                 # 新字段
    type: text
    label: 手机号
```

## 编程方式使用

```typescript
import { ObjectOS } from '@objectos/kernel';

const objectos = new ObjectOS();
await objectos.init();

// 注册基础对象
objectos.registerObject({
  name: 'task',
  label: '任务',
  fields: {
    title: { type: 'text', required: true }
  }
});

// 扩展对象
objectos.registerObject({
  name: 'task',
  label: '扩展任务',
  fields: {
    title: { required: false } as any,  // 重写
    priority: { type: 'select' } as any  // 添加
  }
});
```

## 多层扩展

支持多层叠加扩展：

```typescript
// 第 1 层：基础定义
objectos.registerObject({ name: 'contact', fields: { name: {...} } });

// 第 2 层：第一次扩展
objectos.registerObject({ name: 'contact', fields: { phone: {...} } });

// 第 3 层：第二次扩展
objectos.registerObject({ name: 'contact', fields: { company: {...} } });

// 结果：所有字段合并到一起
```

## 配置多个源

```typescript
const objectos = new ObjectOS({
  source: [
    './base-objects',      // 先加载基础
    './custom-objects'     // 后加载自定义（可重写基础）
  ]
});
```

或使用预设包：

```typescript
const objectos = new ObjectOS({
  presets: ['@objectos/preset-base'],  // 基础定义
  source: './custom-objects'            // 你的重写
});
```

## 合并规则

| 类型 | 行为 |
|------|------|
| 对象顶层属性 | 后者覆盖前者 |
| 字段列表 | 深度合并（新增+重写+删除） |
| 字段属性 | 逐个属性合并 |
| 数组（如 options） | 完全替换（不合并） |
| null 字段 | 删除该字段 |

## 注意事项

1. **对象名称必须匹配**：扩展文件中的 `name` 必须与基础对象一致
2. **数组会被替换**：options、filters 等数组会完全替换，不会合并
3. **加载顺序重要**：后加载的文件会覆盖先加载的
4. **谨慎删除系统字段**：删除 created_at、updated_at 等可能影响功能

## 工具函数

```typescript
import { 
  mergeObjectConfig,   // 合并对象配置
  mergeFieldConfig,    // 合并字段配置
  mergeFields,         // 合并字段列表
  isDeleted,           // 检查是否标记删除
  DELETED_MARKER       // 删除标记
} from '@objectos/kernel';

// 手动合并
const merged = mergeObjectConfig(baseConfig, overrideConfig);

// 检查删除标记
if (isDeleted(field)) {
  console.log('字段已标记删除');
}
```

## 相关文档

- [English Documentation](./extension.md)
- [对象配置](./objects.md)
- [字段类型](./fields.md)
- [架构文档](../ARCHITECTURE.md)
