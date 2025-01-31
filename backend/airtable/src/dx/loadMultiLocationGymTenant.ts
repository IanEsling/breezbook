import {PrismaClient} from '@prisma/client';
import {makeTestId} from "./testIds.js";

const tenant_id = 'breezbook.multi.location.gym';
const environment_id = 'dev';
const locationHarlow = makeTestId(tenant_id, environment_id, 'europe.uk.harlow')
const locationStortford = makeTestId(tenant_id, environment_id, 'europe.uk.bishops-stortford')
const locationWare = makeTestId(tenant_id, environment_id, 'europe.uk.ware')
const gym1Hr = makeTestId(tenant_id, environment_id, 'gym.service.1hr');
const pt1Hr = makeTestId(tenant_id, environment_id, 'pt.service.1hr');
const yoga1Hr = makeTestId(tenant_id, environment_id, 'yoga.1to1.1hr');
const massage30mins = makeTestId(tenant_id, environment_id, 'massage.30mins');
const swim30mins = makeTestId(tenant_id, environment_id, 'swim.30mins');
const ptMike = makeTestId(tenant_id, environment_id, `resource.ptMike`)
const ptMete = makeTestId(tenant_id, environment_id, `resource.ptMete`)

export const multiLocationGym = {
    tenant_id,
    environment_id,
    locationHarlow,
    locationStortford,
    locationWare,
    gym1Hr,
    pt1Hr,
    yoga1Hr,
    massage30mins,
    swim30mins,
    ptMike,
    ptMete
}

export async function loadMultiLocationGymTenant(prisma: PrismaClient): Promise<void> {
    await prisma.tenants.create({
        data: {
            tenant_id,
            name: 'Multi-location Gym',
            slug: tenant_id
        }
    })
    await prisma.locations.create({
        data: {
            id: locationHarlow,
            tenant_id,
            environment_id,
            name: 'Harlow',
            slug: 'harlow',
        }
    });
    await prisma.locations.create({
        data: {
            id: locationStortford,
            tenant_id,
            environment_id,
            name: 'Bishops Stortford',
            slug: 'stortford',
        }
    });
    await prisma.locations.create({
        data: {
            id: locationWare,
            tenant_id,
            environment_id,
            name: 'Ware',
            slug: 'ware',
        }
    });
    const mondayToFriday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const satSun = ['Saturday', 'Sunday']
    const daysOfWeek = [...mondayToFriday, ...satSun]
    const start_time_24hr = '09:00';
    const end_time_24hr = '18:00';
    await prisma.business_hours.createMany({
        data: daysOfWeek.map((day, index) => ({
            id: makeTestId(tenant_id, environment_id, `businessHours#${index + 1}`),
            tenant_id,
            environment_id,
            day_of_week: day,
            start_time_24hr,
            end_time_24hr

        }))
    });
    // Let's make harlow closed on Wednesdays
    const daysLessWednesday = daysOfWeek.filter(day => day !== 'Wednesday')
    await prisma.business_hours.createMany({
        data: daysLessWednesday.map((day, index) => ({
            id: makeTestId(tenant_id, environment_id, `harlowBusinessHours#${index + 1}`),
            tenant_id,
            environment_id,
            day_of_week: day,
            start_time_24hr,
            end_time_24hr,
            location_id: locationHarlow
        }))
    });

    // everywhere is closed on Christmas day, and Harlow on the 26th in addition
    await prisma.blocked_time.createMany({
        data: [
            {
                id: makeTestId(tenant_id, environment_id, `blockedChristmasDay.harlow`),
                tenant_id,
                environment_id,
                location_id: locationHarlow,
                date: '2024-12-25',
                start_time_24hr,
                end_time_24hr
            },
            {
                id: makeTestId(tenant_id, environment_id, `blockedBoxingDay.harlow`),
                tenant_id,
                environment_id,
                location_id: locationHarlow,
                date: '2024-12-26',
                start_time_24hr,
                end_time_24hr
            },
            {
                id: makeTestId(tenant_id, environment_id, `blockedChristmasDay.stortford`),
                tenant_id,
                environment_id,
                location_id: locationStortford,
                date: '2024-12-25',
                start_time_24hr,
                end_time_24hr
            },
            {
                id: makeTestId(tenant_id, environment_id, `blockedChristmasDay.ware`),
                tenant_id,
                environment_id,
                location_id: locationWare,
                date: '2024-12-25',
                start_time_24hr,
                end_time_24hr
            }
        ]
    });


    const resourceTypes = ['personal.trainer', 'massage.therapist', 'yoga.instructor']
    await prisma.resource_types.createMany({
        data: resourceTypes.map((resourceType) => ({
            id: makeTestId(tenant_id, environment_id, `resource.${resourceType}`),
            tenant_id,
            environment_id,
            name: resourceType

        }))
    });
    const personalTrainers = ['ptMike', 'ptMete']
    await prisma.resources.createMany({
        data: personalTrainers.map((pt) => ({
            id: makeTestId(tenant_id, environment_id, `resource.${pt}`),
            tenant_id,
            environment_id,
            name: pt,
            resource_type: makeTestId(tenant_id, environment_id, `resource.personal.trainer`)
        }))
    });
    // ptMike is at harlow Mon-Fri and ware Sat-Sun
    await prisma.resource_availability.createMany({
        data: mondayToFriday.map((day, dayIndex) => ({
            id: makeTestId(tenant_id, environment_id, `ptMikeAvailability.harlow#${dayIndex + 1}`),
            tenant_id,
            environment_id,
            resource_id: ptMike,
            location_id: locationHarlow,
            day_of_week: day,
            start_time_24hr,
            end_time_24hr
        }))
    });
    await prisma.resource_availability.createMany({
        data: satSun.map((day, dayIndex) => ({
            id: makeTestId(tenant_id, environment_id, `ptMikeAvailability.ware#${dayIndex + 1}`),
            tenant_id,
            environment_id,
            resource_id: ptMike,
            location_id: locationWare,
            day_of_week: day,
            start_time_24hr,
            end_time_24hr
        }))
    });
    // ptMete is at harlow on Tue
    await prisma.resource_availability.createMany({
        data: [{
            id: makeTestId(tenant_id, environment_id, `ptMeteAvailability.harlow#1`),
            tenant_id,
            environment_id,
            resource_id: ptMete,
            location_id: locationHarlow,
            day_of_week: 'Tuesday',
            start_time_24hr,
            end_time_24hr
        }]
    });
    const massageTherapists = ['mtMete']
    await prisma.resources.createMany({
        data: massageTherapists.map((masseur, index) => ({
            id: makeTestId(tenant_id, environment_id, `masseur#${index + 1}`),
            tenant_id,
            environment_id,
            name: masseur,
            resource_type: makeTestId(tenant_id, environment_id, `resource.massage.therapist`)
        }))
    });
    // mtMete is at harlow Mon-Fri
    await prisma.resource_availability.createMany({
        data: mondayToFriday.map((day, dayIndex) => ({
            id: makeTestId(tenant_id, environment_id, `mtMeteAvailability.harlow#${dayIndex + 1}`),
            tenant_id,
            environment_id,
            resource_id: makeTestId(tenant_id, environment_id, `masseur#1`),
            location_id: locationHarlow,
            day_of_week: day,
            start_time_24hr,
            end_time_24hr
        }))
    });
    // yiMike is at stortford all the time
    const yogaInstructors = ['yiMike']
    await prisma.resources.createMany({
        data: yogaInstructors.map((yt, index) => ({
            id: makeTestId(tenant_id, environment_id, `yi#${index + 1}`),
            tenant_id,
            environment_id,
            name: yt,
            resource_type: makeTestId(tenant_id, environment_id, `resource.yoga.instructor`)
        }))
    });
    await prisma.tenant_settings.create({
        data: {
            tenant_id,
            environment_id,
            customer_form_id: null,
            iana_timezone: 'Europe/London'
        }
    });
    await prisma.services.createMany({
        data: [
            {
                id: gym1Hr,
                tenant_id,
                environment_id,
                slug: 'gym1hr',
                name: 'Gym session (1hr)',
                description: 'Gym session (1hr)',
                duration_minutes: 60,
                price: 1500,
                price_currency: 'GBP',
                permitted_add_on_ids: [],
                resource_types_required: [],
                requires_time_slot: false
            },
            {
                id: pt1Hr,
                tenant_id,
                environment_id,
                slug: 'pt1hr',
                name: 'Personal training (1hr)',
                description: 'A personal training session with one of our trainers, 60 minutes duration',
                duration_minutes: 60,
                price: 7000,
                price_currency: 'GBP',
                permitted_add_on_ids: [],
                resource_types_required: [makeTestId(tenant_id, environment_id, `resource.personal.trainer`)],
                requires_time_slot: false
            },
            {
                id: yoga1Hr,
                tenant_id,
                environment_id,
                slug: 'yoga.1to1.1hr',
                name: '1hr 1-to-1 Yoga',
                description: 'A 1-to-1 yoga session with one of our instructors, 60 minutes duration',
                duration_minutes: 60,
                price: 7900,
                price_currency: 'GBP',
                permitted_add_on_ids: [],
                resource_types_required: [makeTestId(tenant_id, environment_id, `resource.yoga.instructor`)],
                requires_time_slot: false
            },
            {
                id: massage30mins,
                tenant_id,
                environment_id,
                slug: 'massage.30mins',
                name: '30 minute massage',
                description: 'A 30 minute massage session with one of our therapists',
                duration_minutes: 30,
                price: 4900,
                price_currency: 'GBP',
                permitted_add_on_ids: [],
                resource_types_required: [makeTestId(tenant_id, environment_id, `resource.massage.therapist`)],
                requires_time_slot: false
            },
            {
                id: swim30mins,
                tenant_id,
                environment_id,
                slug: 'swim.30mins',
                name: '30 minute swim',
                description: 'A 30 minute swim session',
                duration_minutes: 30,
                price: 4900,
                price_currency: 'GBP',
                permitted_add_on_ids: [],
                resource_types_required: [],
                requires_time_slot: false
            }
        ]
    });

    await prisma.service_locations.createMany({
        data: [
            // All locations have a gym service
            {
                tenant_id, environment_id, service_id: gym1Hr, location_id: locationHarlow
            },
            {
                tenant_id, environment_id, service_id: gym1Hr, location_id: locationStortford
            },
            {
                tenant_id, environment_id, service_id: gym1Hr, location_id: locationWare,
            },
            // only Harlow and Ware have a PT service
            {
                tenant_id, environment_id, service_id: pt1Hr, location_id: locationHarlow
            },
            {
                tenant_id, environment_id, service_id: pt1Hr, location_id: locationWare
            },
            // only Bishops Stortford has a yoga service
            {
                tenant_id, environment_id, service_id: yoga1Hr, location_id: locationStortford
            },
            // only Harlow has a massage service
            {
                tenant_id, environment_id, service_id: massage30mins, location_id: locationHarlow
            },
            // only Ware and Stortford have a swim service
            {
                tenant_id, environment_id, service_id: swim30mins, location_id: locationWare
            },
            {
                tenant_id, environment_id, service_id: swim30mins, location_id: locationStortford
            }
        ]
    });

}


