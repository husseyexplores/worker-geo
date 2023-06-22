/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const HEADER_APP_JSON = { 'content-type': 'application/json' };

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const isApi = url.pathname.startsWith('/api/');
		let response = ROUTES[url.pathname]?.(request, env, ctx);
		if (response instanceof Promise) response = await response;

		if (response == null) {
			response = isApi
				? new Response(
						JSON.stringify({
							status: 404,
							error: 'Not found',
						}),
						{ status: 404, headers: HEADER_APP_JSON }
				  )
				: new Response('Not found', { status: 404 });
		}

		return response
	},
};

const ROUTES: Record<string, undefined | ((request: Request, env: Env, ctx: ExecutionContext) => Response | Promise<Response>)> = {
	'/api/geo': (req) => {
		const cf = req.cf ?? null;
		return new Response(JSON.stringify(cf), {
			status: 200,
			headers: HEADER_APP_JSON,
		});
	},
};
