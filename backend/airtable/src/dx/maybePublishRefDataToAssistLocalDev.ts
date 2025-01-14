import {prismaClient} from "../prisma/client.js";
import {mandatory} from "@breezbook/packages-core";
import {internalApiPaths} from "../express/expressApp.js";

export async function maybePublishRefDataToAssistLocalDev(): Promise<void> {
    const prisma = prismaClient();
    const maybeServiceMutation = await prisma.mutation_events.findFirst({
        where: {
            entity_type: "services"
        }
    })
    if (maybeServiceMutation) {
        console.log("Service mutation exists, skipping publish")
        return;
    }
    const apiKey = mandatory(process.env.INTERNAL_API_KEY, "No INTERNAL_API_KEY set");
    const rootUrl = mandatory(process.env.BREEZBOOK_URL_ROOT, "No BREEZBOOK_URL_ROOT set");
    const url = `${rootUrl}${internalApiPaths.publishReferenceDataAsMutationEvents}`
        .replace(':envId', 'dev')
        .replace(':tenantId', 'tenant1');
    await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": apiKey
        }
    }).catch(e => console.error(e));
    console.log(`Published reference data as mutation events to aid local dx, by calling ${url}`)
}