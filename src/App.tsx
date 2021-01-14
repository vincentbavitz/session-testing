import React, { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Contained } from "./components/Contained";
import { DataChart, TIME_SCALE } from "./components/DataChart";

function App() {
  const [timeScale, setTimeScale] = useState(TIME_SCALE.ONE_HOUR as TIME_SCALE);

  return (
    <Contained>
      <div className="mt-12">
        <h1 className="text-center w-full text-blue-500 text-xl mb-4">
          Onion Request Success Rate
        </h1>
        <DataChart timeScale={timeScale} />
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setTimeScale(TIME_SCALE.ONE_HOUR)}
          selected={timeScale === TIME_SCALE.ONE_HOUR}
        >
          1hr
        </Button>

        <Button
          onClick={() => setTimeScale(TIME_SCALE.TWO_HOURS)}
          selected={timeScale === TIME_SCALE.TWO_HOURS}
        >
          2hr
        </Button>

        <Button
          onClick={() => setTimeScale(TIME_SCALE.THREE_HOURS)}
          selected={timeScale === TIME_SCALE.THREE_HOURS}
        >
          3hr
        </Button>

        <Button
          onClick={() => setTimeScale(TIME_SCALE.FIVE_HOURS)}
          selected={timeScale === TIME_SCALE.FIVE_HOURS}
        >
          5hr
        </Button>

        <Button
          onClick={() => setTimeScale(TIME_SCALE.TEN_HOURS)}
          selected={timeScale === TIME_SCALE.TEN_HOURS}
        >
          10hr
        </Button>

        <Button
          onClick={() => setTimeScale(TIME_SCALE.ONE_DAY)}
          selected={timeScale === TIME_SCALE.ONE_DAY}
        >
          24hr
        </Button>
      </div>
    </Contained>
  );
}

export default App;
