import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import useSWR from "swr";

// import logo from "./logo.svg";

interface IChartVector {
  x: Date;
  y: number;
}

interface IChartData {
  datasets: [
    {
      label: string;
      borderColor: string;
      data: Array<IChartVector>;
    }
  ];
}

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

const options = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          max: 100,
          min: 0,
        },
        scaleLabel: {
          display: true,
          labelString: "Success Rate, %",
        },
      },
    ],
    xAxes: [
      {
        type: "time",
        time: {
          unit: "second",
          minUnit: "minute",
          unitStepSize: 100,
          displayFormats: {
            second: "h:mm a",
          },
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
        },
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Time",
        },
      },
    ],
    // zoom: {
    //   zoom: {
    //     enabled: false,
    //     drag: true,
    //     mode: "x",
    //     // rangeMin: {
    //     //   x: "Jan",
    //     //   y: null
    //     // },
    //     // rangeMax: {
    //     //   x: "June",
    //     //   y: null
    //     // }
    //   },
    //   pan: {
    //     enabled: true,
    //     mode: "x",
    //     speed: 2,
    //   },
    // },
  },
};

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

export function DataChart({ timeScale }: Props) {
  const [data, setData] = useState({
    datasets: [
      {
        label: "Onion Requests Success Rate",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  } as IChartData);

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

    const slidingResults = filteredResults.map((r) => {
      const time = new Date(r.time.secs_since_epoch * 1000);
      const rate = (100 * r.total_success) / r.total;

      return {
        x: time,
        y: rate,
      };
    });

    const _data: IChartData = {
      datasets: [
        {
          label: "Onion Requests Success Rate",
          borderColor: "rgb(255, 99, 132)",
          data: slidingResults,
        },
      ],
    };

    setData(_data);
  }, [_results, timeScale]);

  console.log("data");

  return <Scatter data={data} options={options} />;
}
