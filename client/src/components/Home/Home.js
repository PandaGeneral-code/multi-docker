import { Table } from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

export const Home = () => {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("api/values/all");
      if (response.status === 200) {
        setData(() => response.data.data);
      } else {
        throw new Error("Could not fetch the list of values");
      }
    } catch (err) {
      console.log(err.message || "Nothing to see. Please move along.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Table />
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </>
  );
};
