import { env } from '@/env'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/demo/trigger-workflow')({
    component: RouteComponent,
})

const triggerWorkflow = createServerFn().handler(async () => {
    const res = await fetch(env.WORKFLOW_URL, {
        method: 'POST',
    })
    return res.json()
})

function RouteComponent() {
    const trigger = useServerFn(triggerWorkflow)
    const mutation = useMutation({
        mutationFn: trigger,
    })
    return <div>
        <button onClick={() => mutation.mutate({})}>Trigger Workflow</button>
        {mutation.isPending && <div>Loading...</div>}
        {mutation.error && <div>Error: {mutation.error.message}</div>}
        {mutation.data && <div>Data: {JSON.stringify(mutation.data)}</div>}
    </div>
}
