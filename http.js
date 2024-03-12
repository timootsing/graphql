async function authenticateUserAndGetToken(username, password) {
    const token = await requestToken(username, password);
    if (token) {
        localStorage.setItem('accessToken', token);
        return token;
    }
    return null;
}

async function requestToken(username, password) {
    const url = "https://01.kood.tech/api/auth/signin";
    const loginRequest = createLoginRequest(username, password);
    return await fetchAndParseResponse(url, loginRequest);
}

function createLoginRequest(username, password) {
    return {
        method: 'POST',
        headers: {
            Authorization: `Basic ` + btoa(`${username}:${password}`)
        }
    };
}

async function fetchUserData(token) {
    const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
    const graphqlRequest = createGraphqlRequest(token);
    return await fetchAndParseResponse(url, graphqlRequest);
}

function createGraphqlRequest(token) {
    return {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: query}),
    };
}

async function fetchAndParseResponse(url, request) {
    const response = await fetch(url, request);
    if (response.ok) {
        return await response.json();
    }
    return null;
}

const query = `
  query {
    user {
      firstName
      lastName
      auditRatio
      attrs
      transactions(where: {event: {id: {_eq: 85}}}) {
        type
        amount
        object {
          name
        }
      }
    }
  }
`;