import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import EventContent from "../../components/event-detail/event-content";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventSummary from "../../components/event-detail/event-summary";
import ErrorAlert from "../../components/ui/error-alert";
import { getEventById, getFeaturedEvents } from "../../helpers/api-utils";
import Comments from "../../components/input/comments";
function EventDetailPage(props) {
    // const router = useRouter();
    // const eventId = router.query.eventID;
    // const event = props.getEventById(eventId);
    const event = props.eventByID;

    if (!event) {
        return <div className="center">
            <p>Loading!</p>
        </div>;
    }
    return <Fragment>
        <Head>
            <title>{event.title}</title>
            <meta name="description" content={event.description} />
        </Head>
        <EventSummary title={event.title} />
        <EventLogistics date={event.date} address={event.location} image={event.image} imageAlt={event.title} />
        <EventContent>
            <p>{event.description}</p>
        </EventContent>
        <Comments eventId={event.id} />
    </Fragment>;
}

export async function getStaticProps(context) {
    const eventId = context.params.eventId;
    const eventByID = await getEventById(eventId);
    return {
        props: {
            eventByID: eventByID
        },
        revalidate: 30
    };
}

export async function getStaticPaths() {
    const allEvents = await getFeaturedEvents();
    const pathParams = allEvents.map(event => {
        return {
            params: {
                eventId: event.id
            },
        };
    });
    return {
        paths: pathParams,
        fallback: 'blocking'
    };
}
export default EventDetailPage;