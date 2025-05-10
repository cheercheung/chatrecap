# 数据库表关系图

## 表关系图

```
+----------------+       +-------------------+       +----------------+
|     User       |       | CreditTransaction |       |     Order      |
+----------------+       +-------------------+       +----------------+
| uuid (PK)      |<----->| id (PK)           |<----->| uuid (PK)      |
| email          |       | user_uuid (FK)    |       | user_uuid (FK) |
| signin_provider|       | amount            |       | amount         |
| signin_openid  |       | type              |       | status         |
| credit_balance |       | order_uuid (FK)   |       | credit_amount  |
| created_at     |       | file_uuid (FK)    |       | payment_id     |
| updated_at     |       | created_at        |       | created_at     |
+----------------+       +-------------------+       +----------------+
        ^                        ^
        |                        |
        |                        |
        v                        v
+----------------+
|    ChatFile    |
+----------------+
| uuid (PK)      |
| user_uuid (FK) |
| session_id     |
| file_type      |
| status         |
| created_at     |
| words_count    |
| storage_path   |
| basic_result_p |
| ai_result_path |
+----------------+
```

## SQL 创建表语句

```sql
-- 用户表
CREATE TABLE "User" (
  "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "signin_provider" VARCHAR(50),
  "signin_openid" VARCHAR(255),
  "credit_balance" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE "Order" (
  "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "user_uuid" UUID NOT NULL,
  "amount" INTEGER NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending',
  "credit_amount" INTEGER NOT NULL,
  "payment_id" VARCHAR(255),
  FOREIGN KEY ("user_uuid") REFERENCES "User" ("uuid")
);

-- 积分交易表
CREATE TABLE "CreditTransaction" (
  "id" SERIAL PRIMARY KEY,
  "user_uuid" UUID NOT NULL,
  "amount" INTEGER NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "order_uuid" UUID,
  "file_uuid" UUID,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_uuid") REFERENCES "User" ("uuid"),
  FOREIGN KEY ("order_uuid") REFERENCES "Order" ("uuid"),
  FOREIGN KEY ("file_uuid") REFERENCES "ChatFile" ("uuid")
);

-- 聊天记录文件表
CREATE TABLE "ChatFile" (
  "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_uuid" UUID,
  "session_id" VARCHAR(255),
  "file_type" VARCHAR(50) NOT NULL,
  "status" VARCHAR(20) DEFAULT 'uploaded',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "words_count" INTEGER,
  "storage_path" VARCHAR(255),
  "basic_result_path" VARCHAR(255),
  "ai_result_path" VARCHAR(255),
  FOREIGN KEY ("user_uuid") REFERENCES "User" ("uuid")
);

-- 创建索引
CREATE INDEX idx_user_email ON "User"("email");
CREATE INDEX idx_order_status ON "Order"("status");
CREATE INDEX idx_credit_transaction_type ON "CreditTransaction"("type");
CREATE INDEX idx_credit_transaction_user ON "CreditTransaction"("user_uuid");
CREATE INDEX idx_chat_file_status ON "ChatFile"("status");
CREATE INDEX idx_chat_file_session ON "ChatFile"("session_id");
```

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  uuid           String    @id @default(uuid())
  email          String    @unique
  signin_provider String?
  signin_openid  String?
  credit_balance Int       @default(0)
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt
  
  // 关联
  transactions   CreditTransaction[]
  orders         Order[]
  chatFiles      ChatFile[]
}

// 订单表
model Order {
  uuid          String    @id @default(uuid())
  created_at    DateTime  @default(now())
  user_uuid     String
  amount        Int       // 金额，单位：分
  status        String    @default("pending")
  credit_amount Int
  payment_id    String?
  
  // 关联
  user          User      @relation(fields: [user_uuid], references: [uuid])
  transactions  CreditTransaction[]
}

// 积分交易表
model CreditTransaction {
  id          Int      @id @default(autoincrement())
  user_uuid   String
  amount      Int
  type        String   // recharge, consume
  order_uuid  String?
  file_uuid   String?  // 关联文件UUID
  created_at  DateTime @default(now())
  
  // 关联
  user        User     @relation(fields: [user_uuid], references: [uuid])
  order       Order?   @relation(fields: [order_uuid], references: [uuid])
  chatFile    ChatFile? @relation(fields: [file_uuid], references: [uuid])
}

// 聊天记录文件表
model ChatFile {
  uuid             String    @id @default(uuid())
  user_uuid        String?   // 可以为NULL（未登录用户）
  session_id       String?   // 会话标识符
  file_type        String
  status           String    @default("uploaded")
  created_at       DateTime  @default(now())
  words_count      Int?
  storage_path     String?
  basic_result_path String?
  ai_result_path   String?
  
  // 关联
  user             User?     @relation(fields: [user_uuid], references: [uuid])
  transactions     CreditTransaction[]
}
```
