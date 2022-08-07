import { useState  } from "react"
import React from 'react';
import {useQuery} from "@apollo/client";
import {GET_QUALIFYING_RACES} from "./graphQLManager"

const defaultPerPage = 1;
const poolInterval = 5;

export default function QualifyingRaces() 
{
  const [currentPage, setPage] = useState(0);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => setRefetchTrigger(Math.random()), poolInterval);
    return () => clearInterval(interval);
  }, []);

  const queryResult = useQuery(GET_QUALIFYING_RACES, {
    variables: { first: defaultPerPage, skip: 0 },
  });

  React.useEffect(() => {
    queryResult.fetchMore({
      variables: {
        first: perPage,
        skip: currentPage * perPage,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return fetchMoreResult || prev;
      },
    });
  }, [queryResult.fetchMore, currentPage, perPage, refetchTrigger]);

  return (
    <div>
      <button onClick={() => setPage(currentPage + 1)}>Next</button>
      <pre>LENGTH = {queryResult.length}</pre>
      <pre>{JSON.stringify(queryResult.data, null, 2)}</pre>
    </div>
  );
}