import React, { ReactElement, useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as OriginApolloProvider
} from '@apollo/client';

import config from '@/apps/parax/config';

export const ApolloProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { graphqlEndpoint } = config;

  const client = useMemo(
    () =>
      new ApolloClient({
        uri: graphqlEndpoint,
        cache: new InMemoryCache()
      }),
    [graphqlEndpoint]
  );
  return <OriginApolloProvider client={client}>{children}</OriginApolloProvider>;
};
