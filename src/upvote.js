import { fromEvent } from 'graphcool-lib';

export default async (event) => {
    try {
        // The `event.context.auth.nodeId` will only be populated if the token is valid.
        if (!event.context.auth || !event.context.auth.nodeId) {
            return { data: null }
        }

        const graphcool = fromEvent(event);
        const api = graphcool.api('simple/v1');

        const { id } = event.data;
        const result = await upvoteNews(api, id);

        return { data: result };
    } catch (e) {
        console.log(e);
        return { error: 'An unexpected error occured during upvote.' }
    }
}

async function upvoteNews(api, id) {
    const { News: { points }} = await api.request(`
        query getNews($id: ID!) {
          News(id: $id) {
            id,
            points
          }
        }
    `, {
        id,
    });
    const { updateNews: data } = await api.request(`
        mutation upvoteNews($id: ID!, $points: Int!) {
            updateNews(id: $id, points: $points) {
              id,
              points
            }
        }
    `, {
        id,
        points: points + 1,
    });
    return data;
}
