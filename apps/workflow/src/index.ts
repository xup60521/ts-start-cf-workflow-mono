import {
    WorkflowEntrypoint,
    WorkflowEvent,
    WorkflowStep,
} from "cloudflare:workers";

/**
 * Welcome to Cloudflare Workers! This is your first Workflows application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Workflow in action
 * - Run `npm run deploy` to publish your application
 *
 * Learn more at https://developers.cloudflare.com/workflows
 */

// User-defined params passed to your Workflow
type Params = {

};

export class Workflow extends WorkflowEntrypoint<Env, Params> {
    async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
        await step.do("my first step", async () => {
            console.log("workflow is triggered")
            return {
                "message": "hello frFom workflow",
                id: event.instanceId
            };
        });

    }
}
export default {
    async fetch(req: Request, env: Env): Promise<Response> {
        let url = new URL(req.url);

        if (url.pathname.startsWith("/favicon")) {
            return Response.json({}, { status: 404 });
        }

        // Get the status of an existing instance, if provided
        // GET /?instanceId=<id here>
        let id = url.searchParams.get("instanceId");
        if (id) {
            let instance = await env.WORKFLOW.get(id);
            return Response.json({
                status: await instance.status(),
            });
        }

        // Spawn a new instance and return the ID and status
        let instance = await env.WORKFLOW.create();
        // You can also set the ID to match an ID in your own system
        // and pass an optional payload to the Workflow
        // let instance = await env.MY_WORKFLOW.create({
        // 	id: 'id-from-your-system',
        // 	params: { payload: 'to send' },
        // });
        return Response.json({
            id: instance.id,
            details: await instance.status(),
        });
    },
};
