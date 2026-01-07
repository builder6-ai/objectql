import { HookContext, ObjectQLContext } from '@objectql/core';

// Optional if filename matches object name, but good practice.
export const listenTo = 'projects';

export async function beforeFind(context: HookContext) {
    if (!context.ctx.isSystem && context.ctx.userId) {
        console.log(`[File Hook] Projects: Restricting access for ${context.ctx.userId}`);
        context.utils.restrict(['owner', '=', context.ctx.userId]);
    }
}

export async function beforeCreate(context: HookContext) {
    if (context.doc) {
        if (!context.doc.owner && context.ctx.userId) {
            console.log(`[File Hook] Projects: Auto-assigning owner ${context.ctx.userId}`);
            context.doc.owner = context.ctx.userId;
        }
    }
}

export const actions = {
    complete: async (ctx: ObjectQLContext, params: { id: string, comment?: string }) => {
        const { id, comment } = params;
        console.log(`[Action] Completing project ${id} by ${ctx.userId}. Comment: ${comment}`);
        
        // Use the context to get a repo for this object
        const repo = ctx.object('projects');
        
        // Update the project status
        await repo.update(id, { 
            status: 'completed',
            description: comment ? `Completed with comment: ${comment}` : undefined
        });
        
        return { success: true, message: "Project completed" };
    }
};

