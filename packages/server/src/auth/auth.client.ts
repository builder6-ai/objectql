import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        provider: "postgres",
        url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/objectql'
    },
    emailAndPassword: {
        enabled: true
    }
});
