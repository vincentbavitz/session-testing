import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import useSWR from "swr";

// import logo from "./logo.svg";

type TResults = Array<{
  time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  total: number;
  total_success: number;
}>;

// const DATA_ENDPOINT = `${
//   process.env.NODE_ENV === "development"
//     ? // ? "https://cors-anywhere.herokuapp.com/"
//       "https://thingproxy.freeboard.io/fetch/"
//     : ""
// }http://167.114.135.147:8000/data`;

const DATA_ENDPOINT = "http://167.114.135.147:8000/data";

export enum TIME_SCALE {
  ONE_HOUR = 3600,
  TWO_HOURS = 7200,
  THREE_HOURS = 10800,
  FIVE_HOURS = 18000,
  TEN_HOURS = 36000,
  ONE_DAY = 86400,
}

interface Props {
  timeScale: TIME_SCALE;
}

interface IChartVector {
  time: number;
  rate: number;
}

type ChartData = Array<IChartVector>;

const CustomTooltip = (props: TooltipProps<ValueType, string | number>) => {
  console.log("props", props); //you check payload
  const rate = props.payload?.[0]?.payload?.rate ?? 0;
  const timestamp = props.payload?.[0]?.payload?.time ?? 0;

  return props.active ? (
    <div className="p-2 bg-white rounded-md">
      <p>Rate: {rate.toFixed(4)}</p>
      <p>{moment(timestamp).format("MMMM Do YYYY, h:mm a")}</p>
    </div>
  ) : null;
};

export function DataChart({ timeScale }: Props) {
  const [data, setData] = useState<ChartData>([]);
  //   datasets: [
  //     {
  //       label: "Onion Requests Success Rate",
  //       borderColor: "rgb(255, 99, 132)",
  //       data: [],
  //     },
  //   ],
  // } as IChartData);

  const { data: _results } = useSWR(DATA_ENDPOINT, {
    initialData: [{}],
    refreshInterval: 45000,
    revalidateOnMount: true,
  });

  useEffect(() => {
    const results = _results as TResults;
    if (!results?.length) {
      return;
    }

    let total = 0;
    let success = 0;
    results.forEach((r) => (total += r.total));
    results.forEach((s) => (success += s.total_success));

    const secondsSinceEpoch = Math.round(Date.now() / 1000);

    console.log("results", results);

    // Results filtered down to the time we want displayed.
    const filteredResults = results.filter(
      (r) => secondsSinceEpoch - r?.time?.secs_since_epoch < timeScale
    );

    console.log("filteredResults", filteredResults);
    console.log("DataChart ➡️ secondsSinceEpoch:", secondsSinceEpoch);
    console.log("DataChart ➡️ timeScale:", timeScale);

    const slidingResults: ChartData = filteredResults.map((r) => {
      const time = r.time.secs_since_epoch * 1000;
      const rate = (100 * r.total_success) / r.total;

      return {
        time,
        rate,
      };
    });

    setData(slidingResults);
  }, [_results, timeScale]);

  const latestResult = Date.now() / 1000;
  const ealiestResult = latestResult - timeScale;

  console.log("data", data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          domain={[ealiestResult, latestResult]}
          tickFormatter={(timestamp: number) => moment(timestamp).format("LT")}
        />
        <YAxis />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Line dot={<></>} type="monotone" dataKey="rate" stroke="#0095FF" />
      </LineChart>
    </ResponsiveContainer>
  );
}
