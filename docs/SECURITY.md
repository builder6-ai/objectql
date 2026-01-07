
# Security Model (Modern RBAC)

* **Philosophy:** Additive Permissions (Union Strategy).
* **Mechanism:** Predicate Pushdown (Injects filters into AST before execution).

### Role Definition (`/roles/*.yml`)

```yaml
kind: Role
name: sales_rep
description: Access to own data only

policies:
  - object: contracts
    actions: [read, update, create] # No delete
    
    # Row Level Security (RLS)
    # Injected into the Query AST as an 'AND' condition
    filters: 
      - ['owner', '=', '$user.id']

    # Field Level Security (FLS)
    # Whitelist approach
    fields: ['*'] 

```
